@echo off
echo Fixing AI Chatbot Docker issues on Windows...

echo.
echo Step 1: Stopping existing containers...
docker-compose down

echo.
echo Step 2: Cleaning Docker cache...
docker system prune -f

echo.
echo Step 3: Rebuilding containers from scratch...
docker-compose build --no-cache

echo.
echo Step 4: Starting services...
docker-compose up -d

echo.
echo Step 5: Checking status...
docker-compose ps

echo.
echo Step 6: Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Step 7: Testing health endpoint...
curl -f http://localhost:3001/health 2>nul
if %errorlevel%==0 (
    echo SUCCESS: Chatbot is running!
    echo Open your browser to: http://localhost:3001
) else (
    echo Services are still starting. Check logs with: docker-compose logs -f chatbot
)

echo.
echo To view real-time logs, run: docker-compose logs -f chatbot
pause
