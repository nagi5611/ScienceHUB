# AWS CLI のインストールと初回設定（FDS テスト用）

FDS テストパイプライン（`setup-aws.sh` や AMI 作業）を進める前に、ローカル PC で **AWS CLI v2** を入れ、IAM ユーザーの認証情報を設定してください。

**注意:** アクセスキーやシークレットを Git にコミットしないでください。`.env` や `.dev.vars` も公開リポジトリに載せないでください。

---

## Windows

### インストール（どちらか一方）

#### 方法 A: winget（推奨）

PowerShell または「ターミナル」で:

```powershell
winget install -e --id Amazon.AWSCLI
```

インストール後、**新しい** PowerShell ウィンドウを開いてから確認します（PATH が反映されます）。

#### 方法 B: 公式 MSI

1. [AWS CLI インストーラ（Windows）](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) から **AWS CLI MSI installer (64-bit)** をダウンロード
2. ウィザードに従ってインストール
3. 新しいターミナルを開く

### インストール確認

```powershell
aws --version
```

例: `aws-cli/2.x.x Python/3.x.x Windows/10 exe/AMD64` のように表示されれば OK です。

### 初回設定（`aws configure`）

README の **1-2. IAM ユーザー** で `sciencehub-fds-test` を作成し、アクセスキーを発行してから実行します。

**デフォルトプロファイル**（`setup-aws.sh` をそのまま使う場合）:

```powershell
aws configure
```

プロンプトへの入力例:

| 項目 | 入力例 |
|------|--------|
| AWS Access Key ID | （IAM で発行したアクセスキー ID） |
| AWS Secret Access Key | （IAM で発行したシークレット） |
| Default region name | `ap-northeast-1` |
| Default output format | `json` |

設定ファイルの保存場所（参考）:

- 認証情報: `%USERPROFILE%\.aws\credentials`
- リージョン等: `%USERPROFILE%\.aws\config`

#### オプション: 名前付きプロファイル `sciencehub-fds`

複数 AWS アカウントを使い分ける場合:

```powershell
aws configure --profile sciencehub-fds
```

同じくリージョン `ap-northeast-1`、出力 `json` を指定します。

このプロファイルを使うときは、コマンドやシェルで環境変数を設定します:

```powershell
$env:AWS_PROFILE = "sciencehub-fds"
$env:AWS_REGION = "ap-northeast-1"
```

Git Bash / WSL で `setup-aws.sh` を実行する場合:

```bash
export AWS_PROFILE=sciencehub-fds
export AWS_REGION=ap-northeast-1
cd infra/fds-test
./setup-aws.sh
```

### 接続テスト（破壊的操作なし）

```powershell
aws sts get-caller-identity
```

名前付きプロファイルの場合:

```powershell
aws sts get-caller-identity --profile sciencehub-fds
```

`Account` / `Arn` / `UserId` が JSON で返れば、認証は成功です。エラーになる場合はキー・リージョン・IAM ユーザーの有無を確認してください。

### PowerShell ヘルパー

リポジトリ同梱の検証スクリプト:

```powershell
cd infra\fds-test
.\verify-aws-cli.ps1
# プロファイル指定:
.\verify-aws-cli.ps1 -Profile sciencehub-fds
```

---

## macOS / Linux（概要）

- **macOS:** `brew install awscli` または [公式 pkg/zip](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Linux:** ディストリのパッケージ、または公式の `install` スクリプト / zip

確認と設定:

```bash
aws --version
aws configure
# または
aws configure --profile sciencehub-fds
aws sts get-caller-identity
```

リージョンは FDS テストと同じ **`ap-northeast-1`** を推奨します。

---

## 次のステップ

CLI が使えることを確認したら、[README.md](./README.md) の **1. AWS リソースの準備** に進んでください。
