@echo off
setlocal
title 8-Bit Sprite Assembler V2
color 0A
cd /d "%~dp0"

set "ASSEMBLER_EXE=%~dp0src-tauri\target\release\sprite-assembler.exe"

echo ============================================================
echo    8-BIT SPRITE ASSEMBLER  --  CURRENT V2
echo    approved catalog and Windows build stay in this checkout
echo ============================================================
echo.

if exist "%ASSEMBLER_EXE%" (
  echo Launching the current V2 desktop executable...
  start "" "%ASSEMBLER_EXE%"
  exit /b 0
)

echo Current V2 executable not found yet.
echo Opening the same live V2 source in the browser instead...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required to run the development server.
  echo Download it from https://nodejs.org/ and try again.
  pause
  exit /b 1
)

node tools\dev-server.mjs --open
if errorlevel 1 pause
