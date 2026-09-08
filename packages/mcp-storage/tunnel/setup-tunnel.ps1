# ScienceHUB Storage MCP - Secure MCP Tunnel setup
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$bin = Join-Path $here "bin\tunnel-client.exe"
$envFile = Join-Path $here ".tunnel.env"
$wrapper = Join-Path $here "run-mcp-storage.ps1"
$profile = "sciencehub-storage"

if (-not (Test-Path $bin)) {
  Write-Error "tunnel-client not found. See README for download steps."
}
if (-not (Test-Path $envFile)) {
  Copy-Item (Join-Path $here ".tunnel.env.example") $envFile
  Write-Host "Created .tunnel.env. Set CONTROL_PLANE_API_KEY and CONTROL_PLANE_TUNNEL_ID, then rerun."
  exit 1
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  $pair = $_ -split '=', 2
  if ($pair.Length -eq 2) {
    Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim()
  }
}

if (-not $env:CONTROL_PLANE_API_KEY -or $env:CONTROL_PLANE_API_KEY -like "*YOUR_*") {
  Write-Error "Set CONTROL_PLANE_API_KEY in .tunnel.env"
}
if (-not $env:CONTROL_PLANE_TUNNEL_ID -or $env:CONTROL_PLANE_TUNNEL_ID -like "*YOUR_*") {
  Write-Error "Set CONTROL_PLANE_TUNNEL_ID in .tunnel.env"
}

$wrapperCmd = Join-Path $here "run-mcp-storage.cmd"
$mcpCommand = "`"$wrapperCmd`""

Write-Host "Initializing profile '$profile'..."
& $bin init `
  --sample sample_mcp_stdio_local `
  --profile $profile `
  --tunnel-id $env:CONTROL_PLANE_TUNNEL_ID `
  --mcp-command $mcpCommand

Write-Host ""
Write-Host "Running doctor..."
& $bin doctor --profile $profile --explain

Write-Host ""
Write-Host "Done. Start with: .\start-tunnel.ps1"
