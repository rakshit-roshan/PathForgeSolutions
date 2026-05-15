@echo off
echo =======================================================
echo     Starting PathForgeSolutions Platform
echo =======================================================
echo.

echo [1/2] Starting Spring Boot Backend (Port 8080)...
cd Backend
:: We use 'start' to open a new command prompt window so it runs in parallel
start "Backend Server" cmd /k ".\mvnw spring-boot:run"
cd ..

:: Wait a few seconds to let backend initialize
timeout /t 5 /nobreak > NUL

echo [2/2] Starting Next.js Frontend (Port 3000)...
cd Frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo =======================================================
echo   Servers are launching in separate windows!
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:8080
echo =======================================================
echo.
pause
