@echo off
setlocal
cd /d "%~dp0"
if not exist "%~dp0..\dist\index.js" (
  echo MCP not built. Run: cd packages\mcp-storage && npm run build
  exit /b 1
)
if exist "%~dp0.tunnel.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%~dp0.tunnel.env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)
if "%SCIENCEHUB_API_URL%"=="" set "SCIENCEHUB_API_URL=https://s.mmh-virtual.jp"
if "%SCIENCEHUB_TOKEN%"=="" (
  echo SCIENCEHUB_TOKEN is not set. Edit tunnel\.tunnel.env
  exit /b 1
)
node "%~dp0..\dist\index.js"
