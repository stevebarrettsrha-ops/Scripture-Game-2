<#
  Puts THE VOYAGE on this Windows computer's desktop and Start menu: two shortcuts, "The
  Voyage" and "The Fullness of Time" (story mode), with the game's mark. Each starts the
  local server (local\serve.ps1) in a minimized window and opens the game in the default
  browser - no internet needed. Closing that minimized window stops the server; left
  alone it stops itself after three idle hours.

    powershell -ExecutionPolicy Bypass -File local\install-shortcuts.ps1 [-Remove]

  The shortcuts point at this folder: if the folder is moved, run this again.
#>
param([switch]$Remove)
$ErrorActionPreference = 'Stop'
$Root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\')
$Desktop = [Environment]::GetFolderPath('Desktop')
$Menu = Join-Path ([Environment]::GetFolderPath('Programs')) 'Scripture Game'
$PS = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$Items = @(
  @{ Name = 'The Voyage';           Page = 'voyage'; Note = 'THE VOYAGE - all the earth within the firmament (played offline from this computer)' },
  @{ Name = 'The Fullness of Time'; Page = 'story';  Note = 'The Fullness of Time - story mode of THE VOYAGE (played offline from this computer)' }
)
$shell = New-Object -ComObject WScript.Shell
if (-not $Remove) { New-Item -ItemType Directory -Force -Path $Menu | Out-Null }
foreach ($it in $Items) {
  foreach ($dir in @($Desktop, $Menu)) {
    $lnk = Join-Path $dir ($it.Name + '.lnk')
    if ($Remove) { if (Test-Path -LiteralPath $lnk) { Remove-Item -LiteralPath $lnk; Write-Host "Removed $lnk" }; continue }
    $s = $shell.CreateShortcut($lnk)
    $s.TargetPath = $PS
    $s.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Minimized -File `"$Root\local\serve.ps1`" -Page $($it.Page) -IdleMinutes 180"
    $s.WorkingDirectory = $Root
    $s.IconLocation = "$Root\local\icon.ico,0"
    $s.WindowStyle = 7
    $s.Description = $it.Note
    $s.Save()
    Write-Host "Made $lnk"
  }
}
if ($Remove -and (Test-Path -LiteralPath $Menu) -and -not (Get-ChildItem -LiteralPath $Menu)) { Remove-Item -LiteralPath $Menu }
Write-Host ''
if ($Remove) { Write-Host 'The shortcuts are removed. The game folder itself is untouched.' }
else { Write-Host 'Done. Double-click "The Voyage" or "The Fullness of Time" on your desktop to play.' }
