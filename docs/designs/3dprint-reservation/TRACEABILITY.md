# 3Dプリント予約 UI — API トレーサビリティ

| Handoff 画面 / 機能 | API |
|---------------------|-----|
| 4週カレンダー + 日別申請 | `GET /api/3dprint/calendar/applications?from&to` |
| 新規申請（予約/依頼） | `POST /api/3dprint/reservations`（`booking_kind`, `start_minute`, `end_minute`） |
| 申請一覧（MineSheet） | `GET /api/3dprint/calendar/reservation-list` |
| 詳細・取消 | `GET /api/3dprint/reservations/:id`, `POST .../cancel` |
| STL アップロード | `POST /api/3dprint/upload/*` |
| 認証・アクセス | `/api/apps/3dprint-reservation/access`, `/api/auth/profile` |
| 管理カレンダー・受領 | `/api/3dprint/admin/*`（既存） |
