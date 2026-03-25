@echo off
REM Peace Coalition Website - Quick Start Script for Windows
REM This script sets up and starts both backend and frontend servers

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   Peace Coalition Website - Quick Start
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend directory not found!
    echo Please run this script from the main war1 directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend directory not found!
    echo Please run this script from the main war1 directory
    pause
    exit /b 1
)

echo [1/4] Setting up Backend...
cd backend

REM Check if virtual environment exists, if not create it
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python 3.9+ is installed and accessible
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Backend setup complete!
echo.

REM Start backend in a new window
echo [2/4] Starting Backend Server...
start "Peace Coalition - Backend" cmd /k python app.py
echo Backend starting in new window...
ping -n 3 localhost > nul
echo.

REM Go to frontend directory
cd ..\frontend

echo [3/4] Setting up Frontend...

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install --quiet
    if errorlevel 1 (
        echo ERROR: Failed to install npm dependencies
        echo Make sure Node.js 16+ is installed
        pause
        exit /b 1
    )
)

echo Frontend setup complete!
echo.

REM Start frontend in a new window
echo [4/4] Starting Frontend Server...
start "Peace Coalition - Frontend" cmd /k npm run dev
echo Frontend starting in new window...
ping -n 3 localhost > nul

echo.
echo ============================================
echo   ✓ All Services Started Successfully!
echo ============================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The website should open automatically in your browser.
echo If not, navigate to http://localhost:3000
echo.
echo To stop the servers, close the command windows.
echo For logs, check the respective command windows.
echo.
pause
