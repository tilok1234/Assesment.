@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required to run the development server.
  echo Download it from https://nodejs.org/ and try again.
  pause
  exit /b 1
)

node tools\dev-server.mjs --open
if errorlevel 1 pause
