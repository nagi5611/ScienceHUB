# FDS テストパイプライン（AWS EC2）

ScienceHUB の **シミュレーション管理 → FDSテスト** から、`.fds` ファイルを AWS EC2（既定 `t3.micro`）で試験実行するためのセットアップ手順です。

## 概要

1. 管理画面で `.fds` を選択して「テスト実行を開始」
2. Cloudflare Worker が R2 に入力を保存し、EC2 を起動
3. EC2 が FDS を実行し、結果 ZIP / ログを R2 にアップロード
4. 完了通知を ScienceHUB に POST（コールバック）
5. EC2 は自動シャットダウン（`terminate`）

**コスト目安（テスト用途）**

| 項目 | 目安 |
|------|------|
| t3.micro オンデマンド（東京） | 約 $0.013/時間 |
| 1分のスモークテスト | 数セント未満 |
| 月5ドル以内 | 常時起動しなければ十分現実的 |

AMI 作成は一度だけ。実行時のみ課金されます。

## 前提

- AWS アカウント
- AWS CLI (`aws`) がローカルで使えること
- ScienceHUB の R2 presigned URL 設定済み（`R2_ACCESS_KEY_ID` など）
- 本番 URL が EC2 から到達可能（`OAUTH_REDIRECT_BASE` またはデプロイ URL）

## 1. AWS リソースの準備

### 1-1. セキュリティグループとサブネット

```bash
cd infra/fds-test
chmod +x setup-aws.sh build-ami.sh
AWS_REGION=ap-northeast-1 ./setup-aws.sh
```

表示された `AWS_EC2_SUBNET_ID` と `AWS_EC2_SECURITY_GROUP_ID` をメモします。

セキュリティグループは **アウトバウンド HTTPS (443) のみ** 許可（R2 とコールバック用）。インバウンドは不要です。

### 1-2. IAM ユーザー

1. IAM でユーザー `sciencehub-fds-test` を作成
2. `iam-policy.json` の内容でインラインポリシーをアタッチ
3. アクセスキーを発行

必要な権限: `RunInstances`, `TerminateInstances`, `DescribeInstances` のみ（最小構成）。

### 1-3. FDS 入り AMI の作成（初回のみ）

1. Amazon Linux 2023 の **t3.micro** を一時起動（パブリックサブネット）
2. SSH で接続し、このリポジトリの `build-ami.sh` を実行:

```bash
sudo bash build-ami.sh
```

ビルド完了後（30〜60分程度）、EC2 コンソールから **イメージの作成** → AMI ID を控える。

3. 一時インスタンスは終了

AMI 内に `/opt/fds/bin/fds` があることが必須です。

## 2. Cloudflare / Wrangler シークレット

プロジェクトルートで設定:

```bash
npx wrangler pages secret put AWS_ACCESS_KEY_ID
npx wrangler pages secret put AWS_SECRET_ACCESS_KEY
npx wrangler pages secret put AWS_REGION
# 例: ap-northeast-1

npx wrangler pages secret put AWS_EC2_FDS_AMI_ID
# 例: ami-0abc123def4567890

npx wrangler pages secret put AWS_EC2_INSTANCE_TYPE
# 省略時 t3.micro。テストなら t3.micro 推奨

npx wrangler pages secret put AWS_EC2_SUBNET_ID
npx wrangler pages secret put AWS_EC2_SECURITY_GROUP_ID

# ランダムな長い文字列（EC2 → ScienceHUB コールバック認証）
npx wrangler pages secret put FDS_JOB_CALLBACK_SECRET
```

ローカル開発では `.dev.vars` に同じキーを記述してください。

## 3. データベースマイグレーション

```bash
npm run db:migrate:local   # ローカル
npm run db:migrate:remote  # 本番
```

`0052_fds_test_jobs.sql` が `sim_fds_jobs` テーブルを作成します。

## 4. 動作確認

1. シミュレーション管理 → **FDSテスト** を開く
2. 「接続状態」がすべて ✓ になることを確認
3. `infra/fds-test/sample/simple_test.fds` をアップロードして実行
4. ジョブが `完了` になり、結果 ZIP をダウンロードできること

## トラブルシュート

| 症状 | 確認事項 |
|------|----------|
| EC2 起動エラー | AMI ID、サブネット、SG、IAM 権限 |
| ずっと「実行中」 | EC2 のシステムログ（user-data）。FDS バイナリパス |
| コールバック失敗 | `FDS_JOB_CALLBACK_SECRET`、`OAUTH_REDIRECT_BASE`、SG の 443 アウトバウンド |
| 10時間で止まる | 仕様（`FDS_JOB_MAX_RUNTIME_HOURS = 10`） |

## ファイル構成

```
infra/fds-test/
  README.md           # このファイル
  iam-policy.json     # IAM 最小権限
  setup-aws.sh        # SG / サブネット補助
  build-ami.sh        # FDS ビルド（AMI 作成前）
  sample/simple_test.fds
```

## 関連コード

- API: `functions/api/simulation/[[path]].ts`（`admin/fds-jobs/*`）
- EC2: `functions/lib/aws/ec2.ts`
- ジョブ: `functions/lib/simulation/fds-jobs.ts`
- UI: `public/apps/simulation-management/js/fds-test.js`
