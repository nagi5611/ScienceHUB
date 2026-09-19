# 造形物コンテスト — 依頼者向けメール

3D印刷予約メール（[`docs/3dprint-reservation-email.md`](3dprint-reservation-email.md)）と同じ Cloudflare Email REST API を使用します。

## 環境変数

- 送信に必須: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `PRINT_3D_EMAIL_FROM`
- 任意: `PRINT_3D_EMAIL_FROM_NAME`, `PRINT_3D_EMAIL_REPLY_TO`, `PRINT_CONTEST_EMAIL_FROM_NAME`（未設定時は表示名「ScienceHUB 造形物コンテスト」）

未設定時は送信をスキップし、API は成功のままです。

## 送信タイミング

| 種別 | タイミング |
|------|------------|
| `submitted` | 依頼登録（自動承認・割当日確定） |
| `rescheduled` | 管理画面でドラッグリスケ |
| `delivered` | ステータス「印刷済み」 |
| `failed` | ステータス「印刷失敗」（`status_comment` があれば本文に記載） |

## テスト送信

管理アプリ（造形物コンテスト管理）→ メンバー一覧内「予約者向けメール」→ `POST /api/contest/admin/settings/test-email`
