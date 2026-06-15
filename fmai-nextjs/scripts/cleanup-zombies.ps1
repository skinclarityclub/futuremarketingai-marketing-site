<#
.SYNOPSIS
  Reap ONLY truly-orphaned dev-tool processes (MCP node servers, dev/next
  servers, lighthouse/playwright chrome, orphan shells) that accumulate and
  exhaust RAM in a multi-terminal Claude Code workflow — without ever touching
  an active session.

.DESCRIPTION
  ROOT CAUSE this addresses (verified 2026-05-30, see
  docs/handover/2026-05-30-pc-zombie-rootcause.md):
    Windows has NO kill-on-parent-death. When a Claude/VS Code terminal is
    force-closed with the window-X, the launcher dies but its children
    (STDIO MCP node servers, next dev servers) are reparented and SURVIVE.
    The dominant leak is STDIO MCP node servers: they bind NO TCP port (so
    the old port-based reapers never saw them) and they are node.exe (so the
    old orphan-shell sweep, which excluded node, never saw them either). They
    accumulated across every session forever. ~8-10 MCP servers x 7-8
    terminals => N x M node explosion.

  SAFE-BY-CONSTRUCTION orphan test (the only reason this is allowed to kill):
    A process is reaped ONLY if walking UP its parent chain (with PID-reuse
    protection) the chain DEAD-ENDS on a DEAD parent BEFORE reaching either
    (a) a live interactive owner  = claude.exe / Code.exe / codex.exe / cursor.exe
    (b) a live Windows system root = explorer/services/svchost/wininit/...
    => An ACTIVE-session process always reaches a live anchor (its claude/Code),
       so it is ALWAYS spared. An UNKNOWN-but-live owner reaches a system root,
       so it is ALSO spared (fail-SAFE on owners we don't recognise). Only a
       process whose real owner is genuinely DEAD dead-ends early => reaped.
    This was validated live: 27/27 active MCP nodes classified ACTIVE, 0 false
    orphans; the active dev server on port 3010 (claude-owned) was spared.

  HARDENING (from adversarial review):
    - python/pythonw are EXCLUDED entirely (graphify runs detached from a
      git-hook; we must never kill an in-progress knowledge-graph update).
    - Port 3000 is NEVER a candidate (Daley's primary dev port stays immortal).
    - MinAgeSeconds grace: anything younger than 180s is spared (don't race a
      session that is still starting up).
    - TOCTOU re-verify: immediately before the kill we re-read the PID and
      confirm Name + CreationDate (+ cmdline for node/bun) still match the
      snapshot; abort the kill on any mismatch (PID-reuse protection).
    - The reaper never touches its own process tree.

  Logging is INTERNAL (Add-Content) — do NOT pass a `*>>` redirect in the
  scheduled-task Arguments: Task Scheduler has no shell, so `*>>` would be
  passed as a literal positional arg, fail to bind to a param, and abort the
  script (this was the historic Result=1 bug). The script always `exit 0`s.

.PARAMETER DryRun
  Report what WOULD be reaped (with each target's full ancestor chain) without
  killing anything. ALWAYS run this first after any change.

.PARAMETER MinAgeSeconds
  Spare any candidate younger than this. Default 180.

.PARAMETER MinClaudeAgeSeconds
  Orphaned claude.exe/codex.exe CLIs (parent chain dead — see below) are only
  reaped past this age. Default 3600 (1h): an active session always has a LIVE
  Code.exe/pwsh parent and is spared regardless of age, so this large grace only
  guards against a transient snapshot race, never a real session.

.NOTE — orphaned claude.exe reaping (added 2026-06-16)
  claude.exe is a live ANCHOR (it protects its children), but the reaper never
  used to consider claude.exe ITSELF a candidate. So a claude whose launcher was
  force-closed with the window-X (no /exit) got reparented and survived for DAYS
  (observed: 73h). It is now reaped — but ONLY when the safe orphan test proves
  its parent chain dead-ends on a DEAD parent. An active session (parent
  Code.exe/pwsh alive => reaches a live anchor) is ALWAYS spared.

.PARAMETER KeepPort
  Dev-server port to never reap. Default 3000.

.PARAMETER DevPortRange
  Ports on which a LISTENING node is considered a dev-server candidate
  (still subject to the orphan test). Default 3001..3099.

.PARAMETER LogPath
  Where to append the run log. Default ~/.claude/hooks/scheduled-cleanup.log

.EXAMPLE
  pwsh -File scripts\cleanup-zombies.ps1 -DryRun      # safe preview
  pwsh -File scripts\cleanup-zombies.ps1              # armed reap
#>
[CmdletBinding()]
param(
  [switch]$DryRun,
  [int]$MinAgeSeconds = 180,
  [int]$MinClaudeAgeSeconds = 3600,
  [int]$KeepPort = 3000,
  [int[]]$DevPortRange = @(3001..3099),
  [string]$LogPath = "$env:USERPROFILE\.claude\hooks\scheduled-cleanup.log"
)

# Self-orphan-detection must never abort the whole task.
$ErrorActionPreference = 'Continue'

# ---- live anchors (active interactive owners) and Windows system roots ----
$ANCHORS = @('claude.exe','code.exe','codex.exe','cursor.exe','windsurf.exe')
$SYSTEM_ROOTS = @('explorer.exe','services.exe','svchost.exe','wininit.exe',
  'winlogon.exe','lsass.exe','csrss.exe','smss.exe','system','idle','dwm.exe',
  'fontdrvhost.exe','sihost.exe','ctfmon.exe','runtimebroker.exe','userinit.exe')

# MCP STDIO server signatures (node/bun). Reaped only when orphaned.
$MCP_SIG = 'mcp-server|modelcontextprotocol|@perplexity-ai|perplexity-mcp|n8n-mcp|task-master|@playwright/test|stitch-mcp|claude-peers|mcp/index|/mcp\b|server-github|server-git\b'
# Lighthouse / agent-browser / playwright chrome — always disposable zombies.
$CHROME_SIG = 'lighthouse\.|agent-browser-chrome|lh-clean-|\\playwright|--headless|ms-playwright'
# Next.js dev servers. Orphaned ones frequently bind NO port (compile crashed,
# or the session that ran `npm run dev` was force-closed), so the port-based
# detection below misses them. Reaped ONLY when the orphan test proves the
# parent chain is dead — an active dev server reaches a live claude/Code anchor.
$NEXTDEV_SIG = 'next[\\/]dist[\\/]bin[\\/]next|next-server|next-router-worker|next-render-worker|scripts[\\/]dev\.mjs'

# ---------------------------------------------------------------------------
$started = Get-Date
$killed  = [System.Collections.Generic.List[object]]::new()
$ramFreed = 0L

function Write-Log([string]$m) {
  $line = "{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $m
  Add-Content -Path $LogPath -Value $line -ErrorAction SilentlyContinue
}

try {
  # rotate log if large
  if ((Test-Path $LogPath) -and (Get-Item $LogPath).Length -gt 64000) {
    $tail = Get-Content $LogPath -Tail 200 -ErrorAction SilentlyContinue
    Set-Content -Path $LogPath -Value $tail -ErrorAction SilentlyContinue
  }

  # ---- single snapshot ----
  $snap = Get-CimInstance Win32_Process -ErrorAction Stop
  $byPid = @{}
  foreach ($p in $snap) { $byPid[[int]$p.ProcessId] = $p }

  # live anchor PIDs (for fast logging only; the walk re-checks names)
  $now = Get-Date

  # protect the reaper's own ancestry (this pwsh + parents)
  $selfChain = @{}
  $c = $PID
  for ($i = 0; $i -lt 60 -and $byPid.ContainsKey([int]$c); $i++) {
    $selfChain[[int]$c] = $true
    $c = [int]$byPid[[int]$c].ParentProcessId
  }

  # ---- the safe orphan test ----
  function Test-Orphan([int]$startPid) {
    $cur = $startPid
    $seen = @{}
    for ($hop = 0; $hop -lt 60; $hop++) {
      if ($seen.ContainsKey($cur)) { return $true }   # cycle => orphan
      $seen[$cur] = $true
      $proc = $byPid[$cur]
      if (-not $proc) { return $true }                 # self missing => orphan
      $ppid = [int]$proc.ParentProcessId
      $parent = $byPid[$ppid]
      $nameLower = ($proc.Name).ToLower()
      if ($ppid -eq 0) {
        # reached pid 0 (System Idle) via live links => live system tree => SPARE
        return $false
      }
      if (-not $parent) {
        # broken link: real parent is dead. Spare only if the last-alive proc
        # is itself an anchor or a system root (=> connected to a live tree).
        # hop 0 = the CANDIDATE itself: a claude.exe whose own parent is dead is
        # an orphaned session, NOT a live anchor — it may not spare itself here.
        # (For every non-anchor candidate this returns true exactly as before.)
        if ($hop -eq 0) { return $true }
        return -not (($ANCHORS -contains $nameLower) -or ($SYSTEM_ROOTS -contains $nameLower))
      }
      # PID-reuse guard: a "parent" created AFTER its child is not the real parent.
      if ($parent.CreationDate -and $proc.CreationDate -and ($parent.CreationDate -gt $proc.CreationDate)) {
        if ($hop -eq 0) { return $true }
        return -not (($ANCHORS -contains $nameLower) -or ($SYSTEM_ROOTS -contains $nameLower))
      }
      $parentLower = ($parent.Name).ToLower()
      if ($ANCHORS -contains $parentLower) { return $false }       # owned by live session
      if ($SYSTEM_ROOTS -contains $parentLower) { return $false }  # live system tree (fail-safe)
      $cur = $ppid
    }
    return $true   # exceeded depth (shouldn't happen) => treat conservatively as orphan
  }

  # ---- build candidate set ----
  $candidates = [System.Collections.Generic.List[object]]::new()

  # listening dev-server ports -> owning PID
  $devPidByPort = @{}
  Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $DevPortRange -contains $_.LocalPort -and $_.LocalPort -ne $KeepPort } |
    ForEach-Object { $devPidByPort[[int]$_.OwningProcess] = $_.LocalPort }

  foreach ($p in $snap) {
    $pid_ = [int]$p.ProcessId
    if ($selfChain.ContainsKey($pid_)) { continue }     # never touch our own tree
    $name = ($p.Name).ToLower()
    $cmd  = [string]$p.CommandLine
    $reason = $null

    if ($name -eq 'node.exe' -or $name -eq 'bun.exe') {
      if ($cmd -match $MCP_SIG)         { $reason = 'mcp-stdio' }
      elseif ($devPidByPort.ContainsKey($pid_)) { $reason = "dev-server:$($devPidByPort[$pid_])" }
      elseif ($cmd -match $NEXTDEV_SIG) { $reason = 'next-dev' }
    }
    elseif ($name -eq 'chrome.exe' -or $name -eq 'headless_shell.exe') {
      if ($cmd -match $CHROME_SIG)      { $reason = 'lighthouse/playwright-chrome' }
    }
    elseif ('powershell.exe','pwsh.exe','cmd.exe','bash.exe','conhost.exe' -contains $name) {
      $reason = 'orphan-shell'
    }
    elseif ('claude.exe','codex.exe' -contains $name) {
      # Orphaned CLI session (launcher force-closed, no /exit). Still subject to
      # the orphan test + the larger MinClaudeAgeSeconds grace below: an active
      # session reaches a live Code.exe/pwsh anchor and is spared.
      $reason = 'orphan-claude'
    }
    # NB: python/pythonw deliberately NOT candidates (protect graphify).

    if ($reason) { $candidates.Add([pscustomobject]@{ P=$p; Pid=$pid_; Name=$name; Cmd=$cmd; Reason=$reason }) }
  }

  # ---- decide + act ----
  foreach ($c in $candidates) {
    $p = $c.P
    # age grace (orphaned claude/codex get the larger MinClaudeAgeSeconds margin)
    $ageSec = if ($p.CreationDate) { ($now - $p.CreationDate).TotalSeconds } else { 99999 }
    $minAge = if ($c.Reason -eq 'orphan-claude') { $MinClaudeAgeSeconds } else { $MinAgeSeconds }
    if ($ageSec -lt $minAge) { continue }

    # EVERY candidate (incl. lighthouse/playwright chrome) must be a PROVEN
    # orphan: walking up its chain must dead-end on a dead parent before
    # reaching any live claude/Code/codex owner or a live Windows system root.
    # An active lighthouse/playwright run (node parent still alive -> chain
    # reaches claude/Code) is therefore SPARED; only the leftover detached
    # chrome trees (parent dead) are reaped. The per-turn Stop hook still does
    # the aggressive regex-only chrome sweep between scheduled runs.
    if (-not (Test-Orphan $c.Pid)) { continue }          # has a live owner => SPARE

    # build ancestor-chain string for the audit log
    $chain = @(); $cc = $c.Pid; $g = @{}
    for ($i=0; $i -lt 12; $i++) {
      if ($g.ContainsKey($cc)) { break }; $g[$cc]=$true
      $pp = $byPid[$cc]; if (-not $pp) { break }
      $chain += ('{0}({1})' -f $pp.Name, $pp.ProcessId)
      $np = [int]$pp.ParentProcessId; if (-not $byPid.ContainsKey($np)) { $chain += 'DEAD'; break }
      $cc = $np
    }
    $chainStr = $chain -join ' <- '
    $ram = [long]$p.WorkingSetSize
    $info = "pid=$($c.Pid) name=$($c.Name) reason=$($c.Reason) age=$([math]::Round($ageSec))s ram=$([math]::Round($ram/1MB))MB chain=[$chainStr]"

    if ($DryRun) {
      Write-Host "[DRY] would reap $info" -ForegroundColor Yellow
      Write-Log "[DRY] would reap $info"
      $killed.Add($c); $ramFreed += $ram
      continue
    }

    # TOCTOU re-verify immediately before the kill
    $live = Get-CimInstance Win32_Process -Filter "ProcessId=$($c.Pid)" -ErrorAction SilentlyContinue
    if (-not $live) { continue }                                   # already gone
    if (($live.Name).ToLower() -ne $c.Name) { continue }          # PID reused
    if ($live.CreationDate -ne $p.CreationDate) { continue }      # PID reused
    if (($c.Name -eq 'node.exe' -or $c.Name -eq 'bun.exe') -and ([string]$live.CommandLine -ne $c.Cmd)) { continue }

    # subtree kill (taskkill /T) so the npx/cmd wrappers + node children all go.
    $null = & taskkill.exe /PID $c.Pid /T /F 2>$null
    Write-Host "[KILL] $info" -ForegroundColor Red
    Write-Log  "[KILL] $info"
    $killed.Add($c); $ramFreed += $ram
  }

  $verb = if ($DryRun) { 'WOULD-REAP' } else { 'REAPED' }
  $byReason = $killed | Group-Object { $_.Reason -replace ':.*','' } | ForEach-Object { "$($_.Name)=$($_.Count)" }
  $summary = "== Summary == $verb $($killed.Count) procs ({0}) ~{1}MB in {2}s" -f `
    (($byReason -join ', ')), [math]::Round($ramFreed/1MB), [math]::Round(((Get-Date)-$started).TotalSeconds,1)
  Write-Host "`n$summary" -ForegroundColor Green
  Write-Log $summary
}
catch {
  Write-Log "ERROR: $($_.Exception.Message)"
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
  # ALWAYS exit 0 so the scheduled task reports success (Result=0).
  exit 0
}
