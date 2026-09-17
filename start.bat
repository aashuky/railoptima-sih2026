@echo off
title RailOptima - Indian Railways Maintenance Block Planning
echo ==========================================================
echo Starting RailOptima Prototype
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:5173
echo ==========================================================

start "RailOptima Backend" cmd /k "cd server && npm start"
timeout /t 2 /nobreak >nul
start "RailOptima Frontend" cmd /k "cd client && npm run dev"

echo Both services launched in separate terminal windows.
