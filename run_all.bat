@echo off
title Cocoa Bliss - Unified Server (Backend + Frontend)
cd /d "%~dp0"
if exist "%~dp0backend_env\Scripts\python.exe" (
    "%~dp0backend_env\Scripts\python.exe" run.py
) else (
    py run.py
)
pause
