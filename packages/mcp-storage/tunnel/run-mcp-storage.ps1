# ScienceHUB MCP server wrapper for tunnel-client
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $here ".tunnel.env"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $pair = $_ -split '=', 2
    if ($pair.Length -eq 2) {
      Set-Item -Path "Env:$($pair[0].Trim())" -Value $pair[1].Trim()
    }
  }
}
if (-not $env:SCIENCEHUB_API_URL) { $env:SCIENCEHUB_API_URL = "https://s.mmh-virtual.jp" }
if (-not $env:SCIENCEHUB_TOKEN) {
  Write-Error "SCIENCEHUB_TOKEN is not set. Edit tunnel/.tunnel.env"
}
$mcpRoot = Resolve-Path (Join-Path $here "..")
$mcpEntry = Join-Path $mcpRoot "dist\index.js"
if (-not (Test-Path $mcpEntry)) {
  Write-Error "MCP not built. Run: cd packages/mcp-storage; npm run build"
}
& node $mcpEntry
