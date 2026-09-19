# 造形物コンテスト — 依頼者向けメール

3D印刷予約メール（[`docs/3dprint-reservation-email.md`](3dprint-reservation-email.md)）と同じ Cloudflare Email REST API を使用します。

## 環境変数

- 送信に必須: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `PRINT_3D_EMAIL_FROM`
- 任意: `PRINT_3D_EMAIL_FROM_NAME`, `PRINT_3D_EMAIL_REPLY_TO`, `PRINT_CONTEST_EMAIL_FROM_NAME`（未設定時は表示名「ScienceHUB 造形物コンテスト」）

未設定時は送信をスキップし、API は成功のままです。

## フロー

1. 依頼者が **印刷依頼** → 印刷日は自動割当、`status=applied`、担当者は未割当  
2. 管理画面で担当を選び **承認（受領）** → Google カレンダー反映、`status=accepted`  
3. 以降、管理画面でステータス・印刷日を変更するとメール通知

## 送信タイミング

| 種別 | タイミング |
|------|------------|
| `submitted` | 印刷依頼受付（印刷日自動設定・承認待ち） |
| `accepted` | 管理画面で承認（担当者が決まりました） |
| `status_changed` | 管理画面でステータス変更（例: 印刷中・印刷済み・失敗） |
| `rescheduled` | 管理画面で印刷日変更（ドラッグリスケ含む） |

## テスト送信

管理アプリ（造形物コンテスト管理）→ メンバー一覧内「予約者向けメール」→ `POST /api/contest/admin/settings/test-email`
