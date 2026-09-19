# 3D印刷 予約者向けメール（Cloudflare Email Service）

予約申請・受領時に、予約したユーザー（D1 `users.email`）へトランザクションメールを送ります。

ScienceHUB は **Cloudflare Pages Functions** のため、送信は **REST API** を使います（`send_email` binding は Pages の wrangler 設定では利用できません）。

- REST API: [Send emails (REST API)](https://developers.cloudflare.com/email-service/api/send-emails/rest-api/)
- Workers binding（参考・別 Worker 向け）: [Workers API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)

## 前提

1. [Cloudflare Email Service](https://developers.cloudflare.com/email-service/) で送信ドメインを有効化  
   `npx wrangler email sending enable yourdomain.com`
2. API トークンに **Email Sending** 権限（[Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)）
3. Pages の環境変数（本番・プレビュー）を設定

## 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | 送信時は必須 | アカウント ID |
| `CLOUDFLARE_API_TOKEN` | 送信時は必須 | Email Sending 可能な API トークン |
| `PRINT_3D_EMAIL_FROM` | 送信時は必須 | From（認証済みドメイン、例: `noreply@mmh-virtual.jp`） |
| `PRINT_3D_EMAIL_FROM_NAME` | 任意 | 表示名（既定: ScienceHUB 3D印刷） |
| `PRINT_3D_EMAIL_REPLY_TO` | 任意 | Reply-To（REST では `reply_to`） |

上記が揃っていない場合はメールは送らず、API は通常どおり成功します（Discord 通知と同様のオプション機能）。

## 送信タイミング

- ユーザー／管理者による **予約申請**（再予約申請を含む）
- 管理画面での **予約受領**（確定）

## 管理画面でのテスト

3D印刷管理 → **メンバー一覧** →「予約者向けメール」で送信先を入力し **テストメールを送信**（`POST /api/3dprint/admin/settings/test-email`、管理アプリ権限が必要）。

## ローカル

`wrangler pages dev` からも REST で実送信できます（トークンと From が正しければ）。または `npx tsx scripts/send-3dprint-test-email.ts you@example.com`。テストは自分が受信できる実アドレスを使ってください（[deliverability ガイド](https://developers.cloudflare.com/email-service/)）。
