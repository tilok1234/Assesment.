@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required to validate the project.
  pause
  exit /b 1
)

node tools\check-project.mjs
set "CHECK_EXIT=%ERRORLEVEL%"
if not "%CHECK_EXIT%"=="0" pause
exit /b %CHECK_EXIT%
