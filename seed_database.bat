@echo off
title Cocoa Bliss - Seed Database
echo ========================================================
echo Seeding Cocoa Bliss Products, Categories, Accounts, and Reviews...
echo ========================================================
cd /d "%~dp0backend"
"%~dp0backend_env\Scripts\python.exe" manage.py seed_data
echo.
echo Database seeding complete!
pause
