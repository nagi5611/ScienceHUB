# Google カレンダー連携 仕様書

ScienceHUB のスケジュール機能を Google カレンダーと同期するための設計・API・セットアップ手順です。

**出典:** 本ドキュメントは [Google Calendar API v3](https://developers.google.com/calendar/api/v3/reference) および [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) の公開仕様に基づいています（2026年時点）。

---

## 1. 連携の考え方

| カレンダー | 用途 | カレンダー名（表示名） |
|-----------|------|------------------------|
| **全体カレンダー** | 全グループの予定を集約 | `自然科学部`（デフォルト、DB で変更可） |
| **グループカレンダー** | 各グループ専用 | 各 `hub_groups.display_name` と同じ名前 |

予定を 1 件追加すると、**2 つの Google カレンダーに同じ内容のイベントが作成**されます（全体 + 該当グループ）。

```
ScienceHUB 予定作成
    ├─→ Google Calendar「自然科学部」  (google_event_id_all)
    └─→ Google Calendar「{グループ名}」 (google_event_id_group)
```

---

## 2. 必要な Google Cloud 設定

### 2.1 Google Cloud プロジェクト

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. **API とサービス → ライブラリ** で **Google Calendar API** を有効化

### 2.2 OAuth 同意画面

- ユーザータイプ: **内部**（Google Workspace 利用時）または **外部**
- スコープに以下を追加:

| スコープ | 用途 |
|---------|------|
| `openid` `email` `profile` | ログイン（ScienceHUB-OAuth） |
| `https://www.googleapis.com/auth/calendar` | カレンダーの作成・イベントの読み書き（推奨） |
| または `https://www.googleapis.com/auth/calendar.events` | イベントのみ（カレンダー作成は不可） |

> **注意:** ログイン用 OAuth（`openid email profile`）とは **別のスコープ** です。カレンダー連携用に **専用のリフレッシュトークン** を取得してください。

#### 本番公開（リフレッシュトークンの定期再取得を避ける）

同意画面が **「テスト中」** のままだと、リフレッシュトークンは **約 7 日で失効** します。長期運用する場合は本番公開してください。

1. **プライバシーポリシーを公開**（必須）
   - URL: `https://s.mmh-virtual.jp/privacy/`
   - リポジトリ: `public/privacy/index.html`
   - デプロイ後、ブラウザで表示できることを確認

2. **OAuth 同意画面のブランディングを入力**
   - [OAuth 同意画面](https://console.cloud.google.com/auth/branding) を開く
   - **アプリケーションのホームページ**: `https://s.mmh-virtual.jp`
   - **プライバシーポリシー**: `https://s.mmh-virtual.jp/privacy/`
   - **承認済みドメイン**: `mmh-virtual.jp`（設定済みであること）
   - **ユーザーサポートメール**: 問い合わせ先メール

3. **公開ステータスを「本番」に変更**
   - [対象ユーザー](https://console.cloud.google.com/auth/audience) → **アプリを公開**
   - カレンダースコープは **センシティブ** のため、Google の **アプリ検証** を求められる場合があります（審査には数日〜数週間）
   - 検証待ちでも、本番公開後に取得したリフレッシュトークンは **7 日制限の対象外** になります

4. **本番公開後にリフレッシュトークンを再取得**（重要）
   - テスト中に取得したトークンは本番移行後も古い制限が残ることがあるため、**本番公開後** に Playground で `refresh_token` を取り直す
   - `GOOGLE_CALENDAR_REFRESH_TOKEN` を Cloudflare シークレットに再登録

5. **管理画面で接続テスト**を実行し、同期が成功することを確認

> **利用規約**リンクは必須ではありません（任意）。プライバシーポリシーがあれば本番公開の最低要件は満たせます。

### 2.3 OAuth クライアント（ログイン用とカレンダー用は別）

Google Cloud Console で **2 つの Web アプリケーション クライアント** を用意します。

| 用途 | 例（コンソール上の名前） | 環境変数 |
|------|-------------------------|----------|
| **ログイン** | `ScienceHUB-OAuth` | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` |
| **カレンダー連携** | `scienceHUBcalendar` | `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` |

> クライアント ID/Secret は **用途ごとに別** です。Playground でリフレッシュトークンを取るときは **カレンダー用クライアント** の ID/Secret を使ってください。

**ログイン用**の承認済みリダイレクト URI:

```
https://s.mmh-virtual.jp/api/auth/oauth/google/callback
http://localhost:8788/api/auth/oauth/google/callback
```

**カレンダー用**（Playground でトークン取得する場合）の承認済みリダイレクト URI:

```
https://developers.google.com/oauthplayground
```

（将来、管理画面から OAuth 連携する場合の例）

```
https://s.mmh-virtual.jp/api/admin/google-calendar/callback
http://localhost:8788/api/admin/google-calendar/callback
```

（現状は手動でリフレッシュトークンを取得する運用でも可。後述）

---

## 3. カレンダーの準備

### 方法 A: 手動作成（初期セットアップ向け）

1. 連携用 Google アカウント（例: `sciencehub-calendar@your-domain.com`）でログイン
2. Google カレンダーで新規カレンダーを作成:
   - 名前: `自然科学部`
   - 名前: 各グループ名（`teamA` など）
3. カレンダー設定 → **カレンダーの統合** から **カレンダー ID** をコピー  
   形式例: `abc123@group.calendar.google.com`

### 方法 B: API で自動作成（将来の管理画面向け）

```
POST https://www.googleapis.com/calendar/v3/calendars
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "summary": "自然科学部",
  "timeZone": "Asia/Tokyo"
}
```

レスポンスの `id` がカレンダー ID です。グループ作成時に同様に `summary: {グループ名}` で作成できます。

---

## 4. ScienceHUB 側の設定

### 4.1 環境変数（Cloudflare Pages シークレット）

| 変数名 | 説明 |
|--------|------|
| `GOOGLE_CALENDAR_CLIENT_ID` | カレンダー用 OAuth クライアント ID（`scienceHUBcalendar` など） |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | カレンダー用 OAuth クライアント Secret |
| `GOOGLE_CALENDAR_REFRESH_TOKEN` | カレンダースコープ付きリフレッシュトークン（上記クライアントで取得） |
| `GOOGLE_CALENDAR_ALL_GROUPS_ID` | 全体カレンダー「自然科学部」のカレンダー ID（管理画面から DB 保存でも可） |

ログイン用の `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` とは **別物** です。混同しないでください。

### 4.2 データベース

| テーブル / カラム | 説明 |
|------------------|------|
| `hub_groups.google_calendar_id` | グループごとの Google カレンダー ID |
| `hub_calendar_settings` | `all_groups_calendar_name`（表示名、デフォルト `自然科学部`）など |
| `hub_schedule_events.google_event_id_all` | 全体カレンダー側のイベント ID |
| `hub_schedule_events.google_event_id_group` | グループカレンダー側のイベント ID |

### 4.3 リフレッシュトークンの取得（OAuth Playground・詳細手順）

#### 事前準備（403 を防ぐ）

OAuth 同意画面が **「テスト」** のとき、ログインする Google アカウントは **テストユーザーに登録されていないとブロック**されます。

1. https://console.cloud.google.com/auth/audience を開く
2. **対象ユーザー**（または「テストユーザー」）→ **ユーザーを追加**
3. ログインに使うメールを追加（例: `harumacci94@gmail.com`）
4. 部用共有アカウントを使う場合は、そのメールも追加

> エラー `403: access_denied` / `審査プロセスを完了していません` は、ほぼこの「テストユーザー未登録」が原因です。  
> ScienceHUB のコード不具合ではありません。

#### OAuth クライアント側の設定

1. https://console.cloud.google.com/apis/credentials
2. **カレンダー用** OAuth クライアント（例: `scienceHUBcalendar`）を開く
3. **承認済みのリダイレクト URI** に必ず追加:
   ```
   https://developers.google.com/oauthplayground
   ```
4. 保存

#### Playground でトークン取得

1. https://developers.google.com/oauthplayground を開く
2. 右上 **⚙（設定）** をクリック
3. **Use your own OAuth credentials** を **ON**
4. **OAuth Client ID** / **OAuth Client secret** を入力（**カレンダー用** `scienceHUBcalendar` のもの）
5. 設定ダイアログを閉じる
6. 左側で **Input your own scopes** に以下を入力して **Add scope**:
   ```
   https://www.googleapis.com/auth/calendar
   ```
7. **Authorize APIs** をクリック
8. **部用の Google アカウント**でログイン（テストユーザーに登録済みのもの）
9. 「scienceHUBcalendar が Google アカウントへのアクセスをリクエストしています」→ **続行** → **許可**
10. **Exchange authorization code for tokens** をクリック
11. 右側の JSON に **`refresh_token`** があるのでコピーして保存

```json
{
  "access_token": "ya29....",
  "refresh_token": "1//0g....",   ← これを GOOGLE_CALENDAR_REFRESH_TOKEN に
  "expires_in": 3599,
  "token_type": "Bearer",
  ...
}
```

#### よくあるハマりどころ

| 現象 | 対処 |
|------|------|
| `403 access_denied` | 同意画面のテストユーザーにログイン Gmail を追加 |
| `redirect_uri_mismatch` | OAuth クライアントに Playground の URI を追加 |
| `refresh_token` が出ない | Playground 設定で自分の Client ID を使う。再認可時は Google アカウント → セキュリティ → サードパーティアクセスから ScienceHUB-auth を削除してから `Authorize APIs` をやり直す |
| ログイン用クライアントと混同 | Playground には **カレンダー用**（`GOOGLE_CALENDAR_CLIENT_ID`）の ID/Secret を入力。ログイン用（`ScienceHUB-OAuth`）ではない |

#### curl で取得する場合（Playground が使えないとき）

ブラウザで以下を開く（値を置き換え）:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://developers.google.com/oauthplayground&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent
```

表示された認可コードを Playground の Step 2 に貼るか、token エンドポイントへ POST:

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id=...
&client_secret=...
&code=認可コード
&grant_type=authorization_code
&redirect_uri=https://developers.google.com/oauthplayground
```

---

## 5. 使用する Google Calendar API

### 5.1 アクセストークン取得（サーバー側）

```
POST https://oauth2.googleapis.com/token

grant_type=refresh_token
&refresh_token={GOOGLE_CALENDAR_REFRESH_TOKEN}
&client_id={GOOGLE_CALENDAR_CLIENT_ID}
&client_secret={GOOGLE_CALENDAR_CLIENT_SECRET}
```

実装: `functions/lib/google-calendar.ts` → `getGoogleCalendarAccessToken()`

### 5.2 イベント作成（予定追加時）

```
POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
Authorization: Bearer {access_token}
Content-Type: application/json
```

**終日イベント:**

```json
{
  "summary": "週次ミーティング",
  "description": "説明文\n\nグループ: teamA\nScienceHUB 予定 ID: sch_xxx",
  "start": { "date": "2026-07-15" },
  "end":   { "date": "2026-07-16" },
  "extendedProperties": {
    "private": {
      "sciencehub_event_id": "sch_xxx",
      "sciencehub_calendar": "自然科学部"
    }
  }
}
```

> 終日イベントの `end.date` は **翌日**（Google の仕様）。

**時間指定イベント:**

```json
{
  "summary": "実験",
  "start": { "dateTime": "2026-07-15T09:00:00", "timeZone": "Asia/Tokyo" },
  "end":   { "dateTime": "2026-07-15T12:00:00", "timeZone": "Asia/Tokyo" }
}
```

実装: `buildGoogleCalendarEventBody()` → `insertGoogleEvent()`

### 5.3 イベント更新（将来）

```
PUT https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}
```

`google_event_id_all` / `google_event_id_group` をキーに更新。

### 5.4 イベント削除（将来）

```
DELETE https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}
```

### 5.5 双方向同期（将来・任意）

Google → ScienceHUB の取り込みには以下のいずれか:

| 方式 | API | 特徴 |
|------|-----|------|
| **Push 通知** | [Events: watch](https://developers.google.com/calendar/api/v3/reference/events/watch) | Webhook URL が必要（Cloudflare Workers で受信） |
| **ポーリング** | `GET .../events?updatedMin=...` | 実装が簡単、遅延あり |

チャンネル ID と `resourceId` を DB に保存し、通知受信時に差分取得するパターンが一般的です。

---

## 6. ScienceHUB API（アプリ内）

### GET `/api/schedule`

| パラメータ | 説明 |
|-----------|------|
| `from` | `YYYY-MM-DD` |
| `to` | `YYYY-MM-DD` |
| `scope` | `mine`（所属グループのみ） / `all`（全グループ） |

レスポンス例:

```json
{
  "can_create": true,
  "creatable_groups": [{ "id": "grp_...", "display_name": "teamA", "color": "#F38020" }],
  "calendar_sync": {
    "enabled": true,
    "all_groups_calendar_name": "自然科学部"
  },
  "events": [{
    "id": "sch_...",
    "title": "MTG",
    "description": "第1会議室",
    "event_date": "2026-07-15",
    "is_all_day": false,
    "start_time": "09:00",
    "end_time": "10:00",
    "time_label": "09:00–10:00",
    "group_display_name": "teamA",
    "group_color": "#F38020",
    "show_details": true,
    "google_synced": true
  }]
}
```

### POST `/api/schedule`

```json
{
  "title": "週次MTG",
  "description": "資料を共有してください",
  "group_id": "grp_...",
  "event_date": "2026-07-15",
  "is_all_day": false,
  "start_time": "09:00",
  "end_time": "10:00"
}
```

レスポンス:

```json
{
  "event": { ... },
  "sync_warnings": [
    "グループ「teamB」に Google カレンダー ID が未設定のためスキップしました"
  ]
}
```

同期は **ベストエフォート**（DB 保存は成功、Google 側のみ失敗時は `sync_warnings` に記録）。

---

## 7. 運用チェックリスト

- [ ] Google Calendar API を有効化
- [ ] カレンダー用 OAuth クライアント（`scienceHUBcalendar` 等）を作成
- [ ] `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` をシークレットに登録
- [ ] プライバシーポリシーを `https://s.mmh-virtual.jp/privacy/` に公開
- [ ] OAuth 同意画面を **本番公開**（テストのままだと refresh_token が約 7 日で失効）
- [ ] カレンダースコープ付きリフレッシュトークンを取得（**本番公開後**・カレンダー用クライアントで）
- [ ] `GOOGLE_CALENDAR_REFRESH_TOKEN` をシークレットに登録
- [ ] 「自然科学部」カレンダーを作成し `GOOGLE_CALENDAR_ALL_GROUPS_ID` を設定
- [ ] 各グループの `hub_groups.google_calendar_id` を設定（管理画面または SQL）
- [ ] `npx wrangler d1 migrations apply sciencehub-db --remote` で `0010` を適用
- [ ] テスト予定を追加し、両カレンダーに反映されることを確認

### グループにカレンダー ID を設定する SQL 例

```sql
UPDATE hub_groups
SET google_calendar_id = 'your-group-calendar-id@group.calendar.google.com'
WHERE slug = 'team-a';
```

---

## 8. セキュリティ上の注意

- リフレッシュトークンは **シークレット** として保管（リポジトリにコミットしない）
- カレンダー連携用アカウントは **専用** にし、必要最小限のカレンダーだけを共有
- ログイン OAuth とカレンダー OAuth はスコープを分離（ログイン時に calendar スコープを付けるとユーザー全員に許可を求めることになる）

---

## 9. 今後の拡張（未実装）

- 管理画面からカレンダー ID 設定・OAuth 連携ボタン
- 予定の編集・削除と Google 側の update/delete 連動
- Google → ScienceHUB の逆同期（watch + webhook）
- サービスアカウント + ドメイン全体の委任（Google Workspace 組織向け）
