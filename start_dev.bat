@echo off
cd /d "%~dp0"
echo Starting Neurostavki Local Server...
echo Directory: %~dp0
call npm run dev
pause
