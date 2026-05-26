<#
.SYNOPSIS
  Start `next dev` with a port-guard: refuses to ladder up to 3001/2/3/...
  when 3000 is already in use, prompts to kill the existing process instead.

.DESCRIPTION
  Default Next.js behavior on port collision is to try the next port. Over
  days of work this accumulates 18+ orphan dev servers consuming GBs of RAM
  (see scripts/cleanup-zombies.ps1 + plan in .claude/plans/). This guard
  forces a deliberate decision: kill the stale process, OR start on a
  different port that you're tracking.

.PARAMETER Port
  Target port. Default 3000.

.PARAMETER Force
  Kill any process holding the port without prompting.

.EXAMPLE
  pwsh -File scripts\start-dev.ps1
  pwsh -File scripts\start-dev.ps1 -Port 3000 -Force
#>
[CmdletBinding()]
param(
  [int]$Port = 3000,
  [switch]$Force
)

$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  $proc = Get-Process -Id $existing.OwningProcess -ErrorAction SilentlyContinue
  $name = if ($proc) { $proc.ProcessName } else { '<gone>' }
  $started = if ($proc -and $proc.StartTime) { $proc.StartTime } else { '?' }
  $ramMB = if ($proc) { [math]::Round($proc.WorkingSet / 1MB, 0) } else { 0 }

  Write-Warning "Port $Port already in use:"
  Write-Host "  PID=$($existing.OwningProcess) name=$name started=$started ram=${ramMB}MB"

  $kill = $Force
  if (-not $Force) {
    $reply = Read-Host "Kill PID $($existing.OwningProcess) and proceed? [y/N]"
    $kill = ($reply -eq 'y' -or $reply -eq 'Y')
  }

  if ($kill) {
    Stop-Process -Id $existing.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 800  # let the port release
  } else {
    Write-Host "Aborted — pick another port or kill manually." -ForegroundColor Yellow
    exit 1
  }
}

$env:PORT = $Port
Write-Host "Starting next dev on port $Port..." -ForegroundColor Green
& npx next dev
