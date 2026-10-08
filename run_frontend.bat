@echo off
title Cocoa Bliss - React Frontend
echo ========================================================
echo Starting Cocoa Bliss Frontend Server on http://127.0.0.1:5173
echo ========================================================
set "PATH=C:\Users\hp\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;%PATH%"
cd /d "%~dp0frontend"
call npm.cmd run dev
pause
