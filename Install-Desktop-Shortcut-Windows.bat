@echo off
rem Puts "The Voyage" and "The Fullness of Time" on your desktop and Start menu: double-click this file.
rem To take them off again:  Install-Desktop-Shortcut-Windows.bat remove
setlocal
set "ARG="
if /i "%~1"=="remove" set "ARG=-Remove"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0local\install-shortcuts.ps1" %ARG%
pause
