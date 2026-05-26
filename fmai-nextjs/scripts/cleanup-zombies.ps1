<#
.SYNOPSIS
  Kill accumulated dev-tool zombies that cause RAM exhaustion.

.DESCRIPTION
  Targets 4 categories:
    1. Next.js servers (next start/next dev) on a configurable port range
    2. Headless Chrome instances launched by Lighthouse or agent-browser
    3. Stale claude.exe sessions older than -ClaudeAgeHours hours
    4. Orphan shells (powershell/pwsh/cmd/bash) whose parent died

  -DryRun lists what would die without killing. -KeepClaudePID and
  -KeepPort protect the actively-running session.

.PARAMETER KeepClaudePID
  The currently-active claude.exe PID. Identified via Task Manager
  (Details -> claude.exe -> sort by Start time -> newest with active
  parent pwsh). Pass 0 to skip Claude cleanup entirely.

.PARAMETER KeepPort
  Port to spare. Default 3000 (user's primary dev port).

.PARAMETER PortRange
  '@(3001..3030)' default. Adjust if your zombies are elsewhere.

.PARAMETER ClaudeAgeHours
  Claude.exe processes older than this AND not equal to -KeepClaudePID
  are killed. Default 6h.

.PARAMETER DryRun
  Print kill targets, do not actually kill. Recommended first run.

.EXAMPLE
  pwsh -File scripts\cleanup-zombies.ps1 -DryRun
  pwsh -File scripts\cleanup-zombies.ps1 -KeepClaudePID 32416
#>
[CmdletBinding()]
param(
  [int]$KeepClaudePID = 0,
  [int]$KeepPort = 3000,
  [int[]]$PortRange = @(3001..3030),
  [int]$ClaudeAgeHours = 6,
  [switch]$DryRun
)

$ErrorActionPreference = 'Continue'
$killed = @{
  NextServers = @()
  Chrome      = @()
  Claude      = @()
  Orphans     = @()
}
$ramFreed = 0L

function Format-Bytes([long]$b) { "{0} MB" -f [math]::Round($b / 1MB, 0) }

function Stop-OneProcess {
  param([int]$Pid_, [string]$Reason, [hashtable]$Bucket, [string]$BucketKey)
  $p = Get-Process -Id $Pid_ -ErrorAction SilentlyContinue
  if (-not $p) { return }
  $ramBefore = $p.WorkingSet
  $info = "PID=$($p.Id) name=$($p.ProcessName) ram=$(Format-Bytes $ramBefore) reason=$Reason"
  if ($DryRun) {
    Write-Host "[DRY] would kill $info" -ForegroundColor Yellow
  } else {
    Write-Host "[KILL] $info" -ForegroundColor Red
    Stop-Process -Id $Pid_ -Force -ErrorAction SilentlyContinue
  }
  $Bucket[$BucketKey] += $Pid_
  $script:ramFreed += $ramBefore
}

# -- Category 1: Next.js zombie servers on PortRange (port-based, most reliable) --
Write-Host "`n== [1/4] Next.js servers on ports $($PortRange[0])-$($PortRange[-1]) (sparing port $KeepPort) ==" -ForegroundColor Cyan
$conns = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $PortRange -contains $_.LocalPort -and $_.LocalPort -ne $KeepPort }
foreach ($c in $conns) {
  $proc = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
  if ($proc -and $proc.ProcessName -eq 'node') {
    Stop-OneProcess -Pid_ $c.OwningProcess -Reason "next on port $($c.LocalPort)" -Bucket $killed -BucketKey 'NextServers'
  }
}
# NB: no cmdline-regex fallback. Port-based detection is predictable and safe
# (won't touch processes on KeepPort or outside PortRange like an active 3031).
# Orphan orchestrator nodes (next dev wrappers without listening sockets) get
# cleaned by Category 4 once their child server is killed.

# -- Category 2: Lighthouse/agent-browser Chrome --
Write-Host "`n== [2/4] Headless Chrome zombies ==" -ForegroundColor Cyan
$lhChromes = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match 'lighthouse\.|agent-browser-chrome|lh-clean-' }
foreach ($c in $lhChromes) {
  Stop-OneProcess -Pid_ $c.ProcessId -Reason "lighthouse/agent-browser chrome" -Bucket $killed -BucketKey 'Chrome'
}

# -- Category 3: Stale claude.exe --
Write-Host "`n== [3/4] Stale claude.exe (older than ${ClaudeAgeHours}h, keeping PID $KeepClaudePID) ==" -ForegroundColor Cyan
if ($KeepClaudePID -eq 0) {
  Write-Host "  -KeepClaudePID is 0, skipping Claude cleanup (set it to your active session PID to enable)" -ForegroundColor Yellow
} else {
  $cutoff = (Get-Date).AddHours(-$ClaudeAgeHours)
  $oldClaudes = Get-Process claude -ErrorAction SilentlyContinue |
    Where-Object { $_.Id -ne $KeepClaudePID -and $_.StartTime -lt $cutoff }
  foreach ($c in $oldClaudes) {
    $age = [math]::Round(((Get-Date) - $c.StartTime).TotalHours, 1)
    Stop-OneProcess -Pid_ $c.Id -Reason "stale claude.exe age=${age}h" -Bucket $killed -BucketKey 'Claude'
  }
}

# -- Category 4: Orphan shells (parent dood) --
Write-Host "`n== [4/4] Orphan shells (parent dood) ==" -ForegroundColor Cyan
$shells = Get-CimInstance Win32_Process -Filter "Name='powershell.exe' OR Name='pwsh.exe' OR Name='cmd.exe' OR Name='bash.exe' OR Name='conhost.exe'" -ErrorAction SilentlyContinue
foreach ($s in $shells) {
  $parent = Get-CimInstance Win32_Process -Filter "ProcessId=$($s.ParentProcessId)" -ErrorAction SilentlyContinue
  if (-not $parent) {
    Stop-OneProcess -Pid_ $s.ProcessId -Reason "orphan ($($s.Name), parent dead)" -Bucket $killed -BucketKey 'Orphans'
  }
}

# -- Summary --
$prefix = if ($DryRun) { "[DRY-RUN] Would kill" } else { "Killed" }
Write-Host "`n== Summary ==" -ForegroundColor Green
Write-Host "$prefix $($killed.NextServers.Count) next-servers"
Write-Host "$prefix $($killed.Chrome.Count) chrome zombies"
Write-Host "$prefix $($killed.Claude.Count) stale claude sessions"
Write-Host "$prefix $($killed.Orphans.Count) orphan shells"
Write-Host "$prefix RAM total: $(Format-Bytes $ramFreed)"

if ($DryRun) {
  Write-Host "`nRun again WITHOUT -DryRun to actually kill these processes." -ForegroundColor Yellow
}
