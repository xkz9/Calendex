@echo off
setlocal
REM One double-click: API + UI + browser. Close the two server windows when finished.

cd /d "%~dp0"

echo Starting Calendar API (port 8000)...
start "Calendar API" /D "%~dp0backend" cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --reload"

echo Waiting for API to start...
timeout /t 2 /nobreak >nul

echo Starting Calendar UI (port 3000)...
start "Calendar UI" /D "%~dp0frontend" cmd /k "npm run dev"

echo Waiting for Vite...
timeout /t 4 /nobreak >nul

start "" "http://localhost:3000"

echo.
echo Opened http://localhost:3000 in your browser.
echo Leave this window open or close it; the API and UI run in the other two windows.
pause
