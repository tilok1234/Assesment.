@echo off
setlocal
title 8-Bit Sprite Assembler V2 (NEW VERSION - Assesment fork)
color 0A
cd /d "%~dp0"

echo ============================================================
echo    8-BIT SPRITE ASSEMBLER  --  V2  (NEW VERSION)
echo    repo: Assesment. fork  -  fast-check workflow enabled
echo    green window = you are NOT running the old repo
echo ============================================================
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
