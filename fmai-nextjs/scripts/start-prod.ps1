<#
.SYNOPSIS
  Start `next start` (production server) with a port-guard. Same guard as
  start-dev.ps1 — refuses to ladder when the target port is taken, prompts
  to kill instead.

.PARAMETER Port
  Target port. Default 3000.

.PARAMETER Force
  Kill any process holding the port without prompting.

.EXAMPLE
  pwsh -File scripts\start-prod.ps1
  pwsh -File scripts\start-prod.ps1 -Port 3000 -Force
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
    Start-Sleep -Milliseconds 800
  } else {
    Write-Host "Aborted — pick another port or kill manually." -ForegroundColor Yellow
    exit 1
  }
}

$env:PORT = $Port
Write-Host "Starting next start on port $Port..." -ForegroundColor Green
& npx next start
