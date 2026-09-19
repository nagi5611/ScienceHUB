# 3D印刷 予約者向けメール（Cloudflare Email Service）

予約申請・受領時に、予約したユーザー（D1 `users.email`）へトランザクションメールを送ります。

ScienceHUB は **Cloudflare Pages Functions** のため、送信は **REST API** を使います。

- REST API: [Send emails (REST API)](https://developers.cloudflare.com/email-service/api/send-emails/rest-api/)

## 前提

1. [Cloudflare Email Service](https://developers.cloudflare.com/email-service/) で送信ドメインを有効化
2. API トークンに **Email Sending** 権限
3. Pages の環境変数（**Production** 含む）を設定

## 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | 送信時は必須 | アカウント ID |
| `CLOUDFLARE_API_TOKEN` | 送信時は必須 | Email Sending 可能な API トークン |
| `PRINT_3D_EMAIL_FROM` | 送信時は必須 | From（認証済みドメイン） |
| `PRINT_3D_EMAIL_FROM_NAME` | 任意 | 表示名（既定: ScienceHUB 3D印刷） |
| `PRINT_3D_EMAIL_REPLY_TO` | 任意 | Reply-To |

未設定の場合はメールは送らず、API は通常どおり成功します。

## 送信タイミング

- 予約申請（再予約・管理者代理申請を含む）
- 管理画面での予約受領（確定）

## 管理画面でのテスト

3D印刷管理 → **メンバー一覧** →「予約者向けメール」→ `POST /api/3dprint/admin/settings/test-email`

## ローカル

`npx tsx scripts/send-3dprint-test-email.ts you@example.com`  
または `DEV_EMAIL_TEST_SECRET` 設定時に `POST /api/dev/test-print-email`
