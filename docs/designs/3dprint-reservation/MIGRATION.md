# 3Dプリント予約 UI 移行メモ

- 一般ユーザーの予約 UI は React（`apps/3dprint-ui`）に置き換え。ビルド成果物は `public/apps/3dprint-reservation/`。
- 旧 vanilla JS は `legacy-js/` に退避。
- **予約ルール（handoff 準拠）**: 予約（`reserve`）は当日以降、依頼（`request`）は印刷日の前日まで。土日は不可（担当シフトなし）。
- 旧 `LEAD_TIME_DAYS=2` は時間枠モード（`booking_kind` 付き POST）では使いません。レガシー POST のみ従来どおり。
- D1: `0106_print_reservation_time_slots.sql` で `booking_kind`, `start_minute`, `end_minute`, `print_printers.machine_lane` を追加。
