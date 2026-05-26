<#
.SYNOPSIS
  Register a Windows Task Scheduler entry that runs cleanup-zombies.ps1
  every hour. Idempotent — safe to re-run; replaces any existing entry.

.DESCRIPTION
  Background defense against zombie accumulation in a 7-8-terminal Claude
  Code workflow. Per-turn Stop-hook (P-8) handles light Chrome cleanup,
  SessionEnd hook (P-6) handles clean exits, but neither catches force-
  closed terminals or sessions that crash. This scheduled task is the
  catch-all safety net.

  Defaults are CONSERVATIVE:
    - Kills next servers on ports 3001-3099 (skips KeepPort 3000)
    - Kills lighthouse-chrome zombies
    - Kills orphan shells (parent dead)
    - Does NOT kill Claude.exe (KeepClaudePID stays 0)

  Task runs:
    - On-demand once at install (verify it works)
    - Every 1 hour thereafter
    - In CURRENT USER context (not SYSTEM) so it sees user processes
    - Only when user is logged in
    - Even on battery (laptops)

  Output logged to ~/.claude/hooks/scheduled-cleanup.log.

.PARAMETER TaskName
  Scheduled Task name. Default: 'Claude-Cleanup-Zombies'

.PARAMETER IntervalMinutes
  How often to run. Default 60.

.PARAMETER Unregister
  Remove the existing task instead of installing.

.EXAMPLE
  pwsh -File scripts\install-scheduled-cleanup.ps1
  pwsh -File scripts\install-scheduled-cleanup.ps1 -Unregister
#>
[CmdletBinding()]
param(
  [string]$TaskName = 'Claude-Cleanup-Zombies',
  [int]$IntervalMinutes = 60,
  [switch]$Unregister
)

$ErrorActionPreference = 'Stop'

# Locate cleanup-zombies.ps1 — must be absolute path for Task Scheduler.
$cleanupScript = Resolve-Path "$PSScriptRoot\cleanup-zombies.ps1" -ErrorAction Stop
$logFile = "$env:USERPROFILE\.claude\hooks\scheduled-cleanup.log"

# Remove existing task first (idempotent install + plain unregister).
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Removing existing task '$TaskName'..." -ForegroundColor Yellow
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

if ($Unregister) {
  Write-Host "Done — task '$TaskName' unregistered." -ForegroundColor Green
  exit 0
}

# Build action: pwsh runs cleanup-zombies, output appended to log.
$action = New-ScheduledTaskAction `
  -Execute 'pwsh.exe' `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$cleanupScript`" *>> `"$logFile`""

# Trigger: now + every hour while user is logged in.
$trigger = New-ScheduledTaskTrigger `
  -Once -At (Get-Date).AddMinutes(2) `
  -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes)

# Run as current user, only when logged on, allow on battery (laptops).
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
  -MultipleInstances IgnoreNew

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Principal $principal `
  -Settings $settings `
  -Description "Hourly cleanup of zombie next servers, lighthouse-chromes, orphan shells. Installed by scripts/install-scheduled-cleanup.ps1. See plan in C:\Users\daley\.claude\plans\ja-op-mijn-pc-sprightly-abelson.md" | Out-Null

Write-Host "Registered task '$TaskName':" -ForegroundColor Green
Write-Host "  runs every $IntervalMinutes min"
Write-Host "  script: $cleanupScript"
Write-Host "  log:    $logFile"
Write-Host ""
Write-Host "Verify in Task Scheduler GUI (taskschd.msc) under Task Scheduler Library."
Write-Host "To remove: pwsh -File scripts\install-scheduled-cleanup.ps1 -Unregister"
