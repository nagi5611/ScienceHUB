# 3Dプリント管理 — Legacy 機能 parity 仕様（検証済み）

根拠: `public/apps/3dprint-management/legacy-js/admin.js`, `shift.js`, `public/js/admin-force-print-reservation-form.js`, `public/js/print-reservation-calendar-ui.js`, `functions/api/3dprint/[[path]].ts`, `functions/lib/3dprint/admin-force-reservation.ts`.

## 機能ツリー

```
3Dプリント管理（管理者）
├── A. 依頼管理（handoff / 新 UI） … 既存 PR #389
│   ├── 4週カレンダー（依頼/予約件数）
│   ├── 日別リスト・詳細・受領/却下
│   └── サイドバー: 担当シフト一括・メンバー・連携
├── B. 月次カレンダー（legacy dashboard）
│   ├── 表示: 1ヶ月グリッド（日曜始まり、前後月パディング）
│   ├── 予約 occurrence を日セルに S/M/L スロット表示
│   ├── 空き日クリック → 管理者予約モーダル（強制モード ON）
│   ├── 満杯/過去日 → トースト（予約不可）
│   └── API: GET admin/reservations, GET admin/calendar/availability?date=
├── C. 強制予約（force）
│   ├── モーダル「仮予約」: 必須項目緩和（HR/氏名/STL 任意）
│   ├── 送信: POST admin/reservations/force
│   ├── 検証: isAdminDateBookable, 満杯チェック, プリンター/規模自動選択
│   └── 通常追加: POST admin/reservations（STL 必須）— 月次からは force が主
├── D. 印刷履歴（history）
│   ├── 全予約を希望日降順・作成日降順
│   ├── 列: 希望日, HR, タイトル, 規模, ステータス, 担当, 詳細
│   └── API: GET admin/reservations
├── E. プリンター管理（printers）
│   ├── 一覧カード（画像, ステータス, ノズル, 動画撮影可）
│   ├── 追加: POST admin/printers (multipart name+image)
│   ├── 編集: PATCH admin/printers/:id, PUT admin/printers/:id/image
│   ├── 削除: DELETE admin/printers/:id
│   └── 印刷動画保存先（グローバル）: GET/PATCH admin/settings/print-video
├── F. プリンターシフト + 担当シフト（shifts パネル）
│   ├── 月次グリッド（legacy shift.js）
│   ├── モード: 担当者 / プリンター 選択
│   ├── 担当: POST admin/shifts/toggle, PUT admin/shifts/availability
│   ├── プリンター: POST admin/shifts/printer-toggle, PUT printer-availability
│   ├── 削除ブロック時 409 + リスケモーダル（RESERVATIONS_ON_DATE）
│   ├── メンバー色: PATCH admin/members/:id color_index
│   └── API: GET admin/shifts?year=&month=
└── G. 印刷動画（予約単位）
    ├── 詳細: POST admin/reservations/:id/print-video (multipart)
    ├── 削除: DELETE …/print-video
    ├── DL: GET …/print-video/download
    └── 前提: PATCH admin/settings/print-video で保存先フォルダ設定
```

## API 検証マトリクス

| 機能 | Method | Path | 実装ファイル |
|------|--------|------|--------------|
| 履歴/月次データ | GET | `admin/reservations` | `[[path]].ts` ~1570 |
| 日別空き | GET | `admin/calendar/availability` | ~1305 |
| 強制予約 | POST | `admin/reservations/force` | ~1324, `admin-force-reservation.ts` |
| プリンター一覧 | GET | `admin/printers` | ~2033 |
| プリンター CRUD | POST/PATCH/DELETE | `admin/printers` | ~2039+ |
| シフト取得 | GET | `admin/shifts` | ~1901 |
| 担当 toggle | POST | `admin/shifts/toggle` | ~2002 |
| 担当 bulk | PUT | `admin/shifts/availability` | ~1974 |
| プリンター toggle | POST | `admin/shifts/printer-toggle` | ~1954 |
| プリンター bulk | PUT | `admin/shifts/printer-availability` | ~1922 |
| 動画設定 | GET/PATCH | `admin/settings/print-video` | ~1505 |
| 動画 UP/DL | POST/DELETE/GET | `admin/reservations/:id/print-video*` | ~2214+ |

## UI 配置（新 React 管理）

| Legacy パネル | React セクション ID | 備考 |
|---------------|---------------------|------|
| dashboard | `month` | 月次カレンダー + 強制予約 |
| history | `history` | |
| printers | `printers` | 動画保存先含む |
| shifts | `shifts` | handoff 一括設定とは別タブ |
| members | handoff サイドバー | Discord ID は legacy 表格で printers セクションへリンク可 |

## 非機能

- 認可: `GET /api/apps/3dprint-management/access`
- タイムゾーン: 日付境界は JST（legacy `todayJst`）
- CSS: `public/css/apps/3dprint-management.css` の `.printer-admin-*`, `.shift-*`, `.calendar-*` を parity パネルで再利用

## テスト観点

1. Playwright: 管理ログイン → 各 nav 表示
2. 手動: 月次空き日 → force 作成 → 履歴に表示
3. プリンター追加 → シフトでプリンター toggle
4. 動画設定 path 保存（API 200）

## 実装マッピング（React）

| ツリー ID | コンポーネント |
|-----------|----------------|
| B | `panels/MonthCalendarPanel.tsx` |
| C | `panels/ForceReservationModal.tsx` |
| D | `panels/HistoryPanel.tsx` |
| E | `panels/PrintersPanel.tsx` |
| F | `panels/ShiftMonthPanel.tsx` |
| G | `panels/LegacyReservationDrawer.tsx`, `ReviewSheet` PrintVideoSection |

## 検証ログ（2026-10-30 JST）

- [x] API ルートを `[[path]].ts` で突合
- [x] legacy `admin.js` / `shift.js` のパネル名・フローをツリーに反映
- [x] `npm run build:3dprint-ui:management` / `npm run typecheck` 成功
- [ ] Playwright 管理 spec（CI / ローカル wrangler 要）
