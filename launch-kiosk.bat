@echo off
REM Start your app in development mode
start "" cmd /k "cd /d C:\Users\mukes\Open-Kiosk-App && npm run dev"

REM Give the app a few seconds to start
timeout /t 3

REM Open Chrome in full-screen kiosk mode
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk http://localhost:8080

REM Alternatively, to use Edge:
:: start "" msedge.exe --start-fullscreen --app=http://localhost:8080
