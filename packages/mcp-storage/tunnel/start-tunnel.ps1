# ScienceHUB Storage MCP - Secure MCP Tunnel launcher
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$bin = Join-Path $here "bin\tunnel-client.exe"
$envFile = Join-Path $here ".tunnel.env"
$profile = "sciencehub-storage"

if (-not (Test-Path $bin)) {
  Write-Error "tunnel-client not found."
}
if (-not (Test-Path $envFile)) {
  Write-Error "Run .\setup-tunnel.ps1 first."
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  $pair = $_ -split '=', 2
  if ($pair.Length -eq 2) {
    Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim()
  }
}

if (-not $env:CONTROL_PLANE_API_KEY) {
  Write-Error "CONTROL_PLANE_API_KEY is not set in .tunnel.env"
}

Write-Host "Starting tunnel-client (Ctrl+C to stop)."
Write-Host "Local UI: http://127.0.0.1:8080/ui"
Write-Host "ChatGPT: Settings - Connectors - Connection Tunnel"
Write-Host ""

& $bin run --profile $profile
