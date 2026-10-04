@echo off
rem Play THE VOYAGE on this computer, with no internet needed: double-click this file.
rem Leave the window that opens running while you play; close it to stop.
rem   Play-Windows.bat story     goes straight to The Fullness of Time
rem   Play-Windows.bat unfolds   opens Scripture Unfolds
setlocal
set "PAGE=%~1"
if "%PAGE%"=="" set "PAGE=voyage"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0local\serve.ps1" -Page %PAGE%
if errorlevel 1 pause
