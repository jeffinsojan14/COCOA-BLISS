@echo off
title Cocoa Bliss - Django Backend
echo ========================================================
echo Starting Cocoa Bliss Backend Server on http://127.0.0.1:8000
echo ========================================================
cd /d "%~dp0backend"
"%~dp0backend_env\Scripts\python.exe" manage.py runserver 127.0.0.1:8000
pause
