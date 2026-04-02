@echo off
echo Setting up backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Installing Python packages...
pip install -r requirements.txt
echo Backend setup complete!
pause



