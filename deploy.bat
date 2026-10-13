@echo off
:: ============================================================
:: SmartStock ERP — One-Click GitHub Push + Vercel Deploy
:: Run this ONCE after entering your GitHub token below
:: ============================================================

echo.
echo ============================================================
echo   SmartStock ERP - Automated Deploy Script
echo ============================================================
echo.

:: ── Step 1: Get GitHub username ─────────────────────────────
set /p GH_USER="Enter your GitHub username (e.g. gamberaopetspoorthi06): "

:: ── Step 2: Get GitHub PAT ──────────────────────────────────
echo.
echo To create a GitHub token:
echo  1. Go to: https://github.com/settings/tokens/new
echo  2. Note: smartstock-deploy
echo  3. Expiration: 90 days
echo  4. Scopes: check [repo] (top checkbox)
echo  5. Click "Generate token" and COPY it
echo.
set /p GH_TOKEN="Paste your GitHub Personal Access Token here: "

:: ── Step 3: Create GitHub repo via API ──────────────────────
echo.
echo [1/4] Creating GitHub repository...
curl -s -X POST ^
  -H "Authorization: token %GH_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"smartstock-erp\",\"description\":\"SmartStock ERP - AI-Powered Inventory Management\",\"private\":false}" ^
  https://api.github.com/user/repos > repo_response.json

findstr /C:"\"full_name\"" repo_response.json >nul
if %errorlevel% equ 0 (
    echo [OK] Repository created: https://github.com/%GH_USER%/smartstock-erp
) else (
    echo [INFO] Repository may already exist - continuing...
)
del repo_response.json 2>nul

:: ── Step 4: Push code to GitHub ─────────────────────────────
echo.
echo [2/4] Pushing code to GitHub...
git remote remove origin 2>nul
git remote add origin https://%GH_TOKEN%@github.com/%GH_USER%/smartstock-erp.git
git branch -M main
git push -u origin main --force

if %errorlevel% equ 0 (
    echo [OK] Code pushed to GitHub successfully!
) else (
    echo [ERROR] Push failed - check token and try again
    pause
    exit /b 1
)

:: ── Step 5: Deploy to Vercel ────────────────────────────────
echo.
echo [3/4] Deploying to Vercel...
echo (Browser will open for Vercel login - sign in with GitHub)
echo.
npx vercel --prod --yes 2>&1

echo.
echo ============================================================
echo   DEPLOYMENT COMPLETE!
echo ============================================================
echo.
echo Your app is LIVE on Vercel! Check the URL above ^
echo.
echo NEXT STEPS:
echo  1. Set up Aiven MySQL at: https://aiven.io
echo  2. Set up Render backend at: https://render.com
echo  3. See full guide in your artifacts folder
echo.
pause
