# infra/fds-test/verify-aws-cli.ps1
# AWS CLI が PATH にあり、sts get-caller-identity が成功するか確認する（読み取りのみ）

param(
    [string]$Profile = ""
)

$ErrorActionPreference = "Stop"

function Write-Ok($msg) { Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "[NG] $msg" -ForegroundColor Red }

Write-Host "AWS CLI 検証（FDS テスト用）" -ForegroundColor Cyan
Write-Host ""

$awsCmd = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCmd) {
    Write-Fail "aws が PATH に見つかりません。infra/fds-test/aws-cli-setup.md を参照してインストールしてください。"
    exit 1
}
Write-Ok "aws のパス: $($awsCmd.Source)"

try {
    $versionLine = & aws --version 2>&1 | Out-String
    $versionLine = $versionLine.Trim()
    if (-not $versionLine) {
        Write-Fail "aws --version が空の出力でした。"
        exit 1
    }
    Write-Ok $versionLine
} catch {
    Write-Fail "aws --version の実行に失敗しました: $_"
    exit 1
}

$stsArgs = @("sts", "get-caller-identity", "--output", "json")
if ($Profile) {
    $stsArgs += @("--profile", $Profile)
    Write-Host "プロファイル: $Profile"
}

try {
    $identityJson = & aws @stsArgs 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "aws sts get-caller-identity が失敗しました（終了コード $LASTEXITCODE）。"
        Write-Host $identityJson
        exit 1
    }
    $identity = $identityJson | ConvertFrom-Json
    Write-Ok "Caller: Account=$($identity.Account) Arn=$($identity.Arn)"
} catch {
    Write-Fail "sts get-caller-identity の実行に失敗しました: $_"
    exit 1
}

Write-Host ""
Write-Host "検証完了。README の「1. AWS リソースの準備」に進めます。" -ForegroundColor Cyan
exit 0
