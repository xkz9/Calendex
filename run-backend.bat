@echo off
echo Starting backend server...
cd backend
call venv\Scripts\activate.bat
uvicorn main:app --reload
pause
