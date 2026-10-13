@echo off
title SmartStock ERP - AI Inventory Management System
echo ======================================================================
echo Launching SmartStock ERP - AI Inventory Management System
echo (3rd Year CSE B.Tech Minor Project)
echo Operating Currency: Indian Rupees (INR - ₹)
echo ======================================================================
cd /d "%~dp0"
start http://localhost:5173/
npm run dev
pause
