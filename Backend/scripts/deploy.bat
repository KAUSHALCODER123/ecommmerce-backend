@echo off
echo 🚀 Starting production deployment...

echo 📦 Building application...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🔒 Running security audit...
call npm audit --audit-level high
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🧪 Running tests...
call npm test
if %errorlevel% neq 0 exit /b %errorlevel%

echo ✅ Deployment completed successfully!