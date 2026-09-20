# 造形物コンテスト — 依頼者向けメール

3D印刷予約メール（[`docs/3dprint-reservation-email.md`](3dprint-reservation-email.md)）と同じ Cloudflare Email REST API を使用します。

## 環境変数

- 送信に必須: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `PRINT_3D_EMAIL_FROM`
- 任意: `PRINT_3D_EMAIL_FROM_NAME`, `PRINT_3D_EMAIL_REPLY_TO`, `PRINT_CONTEST_EMAIL_FROM_NAME`（未設定時は表示名「ScienceHUB 造形物コンテスト」）
- 任意: **`PRINT_CONTEST_EMAIL_STAFF_NAME`** — 印刷担当メンバーが未割り当てのときだけ、メール署名に使うフォールバック（未設定時は「担当者」）。通常は **メンバー登録の印刷担当者の名前** が使われます。

未設定時は送信をスキップし、API は成功のままです。

## フロー

1. 依頼者が **参加申請**（作品タイトル・感想・制作者メンバー）→ 自動承認  
2. 依頼者が **作品ごとに STL 提出** → 印刷日は自動割当、`status=applied`、担当者は未割当  
3. 管理画面で担当を選び **承認（受領）** → Google カレンダー反映、`status=accepted`  
4. 以降、管理画面でステータス・印刷日を変更するとメール通知

## 送信タイミング

| 種別 | タイミング |
|------|------------|
| 参加申請完了 | 参加申請受付（STL 提出を案内。印刷予約はまだない） |
| `submitted` | STL 提出・印刷依頼受付（印刷日自動設定・承認待ち） |
| `accepted` | 管理画面で承認（担当者が決まりました） |
| `status_changed` | 管理画面でステータス変更（例: 印刷中・印刷済み・失敗） |
| `rescheduled` | 管理画面で印刷日変更（ドラッグリスケ含む） |

## 管理画面からの個別送信

依頼詳細モーダル → **依頼者へメール**。入力できるのは **送信内容のみ** です。メール担当者名は **印刷担当で選んだ登録メンバーの名前**（依頼詳細の「印刷担当は」と連動）が読み取り専用で表示されます。

`POST /api/contest/admin/reservations/:id/custom-email` — body: `{ "message": "...", "print_staff_member_id": "任意（申請中で未受領のとき、選択中の担当者ID）" }`

## テスト送信

管理アプリ（造形物コンテスト管理）→ メンバー一覧内「予約者向けメール」→ `POST /api/contest/admin/settings/test-email`
