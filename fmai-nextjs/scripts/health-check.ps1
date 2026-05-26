<#
.SYNOPSIS
  PC health-check — RAM, disk, zombies, heavy processes. One glance answer:
  is my PC clean, or does it need attention?

.DESCRIPTION
  Read-only. Returns a status banner (HEALTHY / WARN / CRITICAL) plus
  actionable next steps. Run whenever PC feels sluggish, or daily as a
  habit (alias 'hc' suggested in the PS profile).

  Thresholds:
    RAM       OK <80% used   WARN 80-90%   CRITICAL >90%
    Disk      OK <80% used   WARN 80-90%   CRITICAL >90%
    Zombies   OK 0-2 ports   WARN 3-5      CRITICAL >5
    Orphans   OK 0-10        WARN 11-30    CRITICAL >30
    Old Claudes  OK <=2 actief        WARN 3-5            CRITICAL >5 (older than 12h)

.EXAMPLE
  pwsh -File scripts\health-check.ps1
  hc                                # via PS profile alias
#>
[CmdletBinding()]
param()

function Get-StatusColor([string]$Status) {
  switch ($Status) {
    'OK'       { 'Green' }
    'WARN'     { 'Yellow' }
    'CRITICAL' { 'Red' }
    default    { 'White' }
  }
}

function Get-MetricStatus([double]$Value, [double]$WarnAt, [double]$CritAt) {
  if ($Value -ge $CritAt) { return 'CRITICAL' }
  if ($Value -ge $WarnAt) { return 'WARN' }
  return 'OK'
}

Write-Host "`n  PC Health Check — $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor Cyan
Write-Host ('  ' + ('-' * 56)) -ForegroundColor DarkGray

$worstStatus = 'OK'
function Update-Worst([string]$s) {
  $rank = @{ 'OK' = 0; 'WARN' = 1; 'CRITICAL' = 2 }
  if ($rank[$s] -gt $rank[$script:worstStatus]) { $script:worstStatus = $s }
}

# -- RAM --
$os = Get-CimInstance Win32_OperatingSystem
$totalRamGB = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
$freeRamGB = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
$usedRamGB = [math]::Round($totalRamGB - $freeRamGB, 1)
$ramPct = [math]::Round($usedRamGB / $totalRamGB * 100, 0)
$ramStatus = Get-MetricStatus $ramPct 80 90
Update-Worst $ramStatus
Write-Host ("  RAM       {0,-9}  {1} GB used / {2} GB total ({3}%)" -f $ramStatus, $usedRamGB, $totalRamGB, $ramPct) -ForegroundColor (Get-StatusColor $ramStatus)

# -- Disk --
$vol = Get-Volume -DriveLetter C
$diskTotalGB = [math]::Round($vol.Size / 1GB, 0)
$diskFreeGB = [math]::Round($vol.SizeRemaining / 1GB, 1)
$diskPct = [math]::Round(($vol.Size - $vol.SizeRemaining) / $vol.Size * 100, 0)
$diskStatus = Get-MetricStatus $diskPct 80 90
Update-Worst $diskStatus
Write-Host ("  Disk C:   {0,-9}  {1} GB free / {2} GB total ({3}% used)" -f $diskStatus, $diskFreeGB, $diskTotalGB, $diskPct) -ForegroundColor (Get-StatusColor $diskStatus)

# -- Zombie dev ports --
$devPorts = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -ge 3001 -and $_.LocalPort -le 3099 }
$portCount = @($devPorts).Count
$portStatus = Get-MetricStatus $portCount 3 6
Update-Worst $portStatus
Write-Host ("  Zombies   {0,-9}  {1} next-server zombies on ports 3001-3099" -f $portStatus, $portCount) -ForegroundColor (Get-StatusColor $portStatus)

# -- Orphan shells --
$allProcs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue
$pidSet = @{}
foreach ($p in $allProcs) { $pidSet[$p.ProcessId] = $true }
$orphans = $allProcs | Where-Object {
  'powershell.exe', 'pwsh.exe', 'cmd.exe', 'bash.exe', 'conhost.exe', 'python.exe', 'pythonw.exe' -contains $_.Name -and -not $pidSet[$_.ParentProcessId]
}
$orphanCount = @($orphans).Count
$orphanStatus = Get-MetricStatus $orphanCount 11 31
Update-Worst $orphanStatus
Write-Host ("  Orphans   {0,-9}  {1} orphan shells/scripts (parent dead)" -f $orphanStatus, $orphanCount) -ForegroundColor (Get-StatusColor $orphanStatus)

# -- Old Claudes (>12h) --
$oldClaudes = Get-Process claude -ErrorAction SilentlyContinue |
  Where-Object { $_.StartTime -lt (Get-Date).AddHours(-12) }
$claudeCount = @($oldClaudes).Count
$claudeStatus = Get-MetricStatus $claudeCount 3 6
Update-Worst $claudeStatus
$claudeTotal = @(Get-Process claude -ErrorAction SilentlyContinue).Count
Write-Host ("  Claudes   {0,-9}  {1} stale (>12h) / {2} total claude.exe" -f $claudeStatus, $claudeCount, $claudeTotal) -ForegroundColor (Get-StatusColor $claudeStatus)

# -- Lighthouse chrome zombies --
$lhChromes = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match 'lighthouse\.|agent-browser-chrome|lh-clean-' }
$lhCount = @($lhChromes).Count
$lhStatus = Get-MetricStatus $lhCount 1 4
Update-Worst $lhStatus
Write-Host ("  LH Chrome {0,-9}  {1} lighthouse/agent-browser chrome zombies" -f $lhStatus, $lhCount) -ForegroundColor (Get-StatusColor $lhStatus)

# -- Scheduled cleanup task active? --
$task = Get-ScheduledTask -TaskName 'Claude-Cleanup-Zombies' -ErrorAction SilentlyContinue
if ($task -and $task.State -eq 'Ready') {
  $taskInfo = Get-ScheduledTaskInfo -TaskName 'Claude-Cleanup-Zombies'
  $nextRun = $taskInfo.NextRunTime
  Write-Host ("  AutoTask  {0,-9}  Ready, next run {1:HH:mm}" -f 'OK', $nextRun) -ForegroundColor Green
} else {
  Write-Host ("  AutoTask  {0,-9}  Scheduled task NOT installed — run install-scheduled-cleanup.ps1" -f 'WARN') -ForegroundColor Yellow
  Update-Worst 'WARN'
}

Write-Host ('  ' + ('-' * 56)) -ForegroundColor DarkGray
Write-Host ("  Overall: {0}" -f $worstStatus) -ForegroundColor (Get-StatusColor $worstStatus) -NoNewline

# -- Action hints --
if ($worstStatus -ne 'OK') {
  Write-Host ""
  Write-Host "  Suggested actions:" -ForegroundColor Cyan
  if ($ramStatus -ne 'OK' -or $orphanStatus -ne 'OK' -or $portStatus -ne 'OK' -or $lhStatus -ne 'OK') {
    Write-Host "    cz              # run cleanup-zombies.ps1 (port + chrome + orphan sweep)"
  }
  if ($claudeStatus -ne 'OK') {
    Write-Host "    cz -KeepClaudePID <your-PID>   # also kills old Claude sessions"
  }
  if ($diskStatus -ne 'OK') {
    Write-Host "    npm cache clean --force        # clears npm-cache (often 5-20 GB)"
    Write-Host "    Remove-Item `$env:TEMP\* -Recurse -Force -ErrorAction SilentlyContinue"
  }
  Write-Host ""
} else {
  Write-Host "   — all clean, niets te doen" -ForegroundColor Green
  Write-Host ""
}
