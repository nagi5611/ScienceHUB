# シミュレーション依頼 — 電話番号認証（Firebase / Identity Platform）

FDS シミュレーション依頼の前に、依頼者の日本国内携帯番号を SMS で検証します。**認証の有効期限は1年**で、期限切れ後は再認証が必要です。ScienceHUB のログイン（Cookie セッション）はそのまま利用し、Firebase は SMS OTP と ID トークン発行のみに使います。

**法的な最終判断は組織の法務確認を推奨します。** 同意文は [`legal/sim-sms-consent-ja.md`](legal/sim-sms-consent-ja.md) を参照してください。

## 1. Firebase プロジェクト

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成（または既存 GCP プロジェクトをリンク）。
2. **料金プランを Blaze（従量課金）に変更** — Phone Authentication は Spark では本番 SMS 不可。
3. **Authentication** → Sign-in method → **電話番号** を有効化。
4. **Authentication** → Settings → **SMS リージョンポリシー** で **日本（JP）のみ** を許可。
5. プロジェクトの設定 → 全般 → **マイアプリ** → Web アプリを追加し、設定オブジェクトを控える:
   - `apiKey`, `authDomain`, `projectId`, `appId`
6. **Authentication** → Settings → **承認済みドメイン** に以下を追加:
   - 本番: `s.mmh-virtual.jp`（実際のホスト名）
   - ローカル: `localhost`
7. **App Check**（推奨）: Web で reCAPTCHA v3 または Enterprise を登録し、Authentication に適用（SMS ポンピング対策）。
8. **テスト用電話番号**（開発）: Authentication → Sign-in method → Phone → **テスト用の電話番号** に番号と固定コードを登録。
9. **SMS 本文**（必須）: Authentication → **テンプレート** → **SMS 認証**（コンソール表記は「SMS verification」等）を編集し、次の1行にする（`%LOGIN_CODE%` は Firebase が6桁コードに置換するプレースホルダー。**削除・変更しない**）:

   ```text
   ScienceHUBの確認コードは%LOGIN_CODE%です。
   ```

   日本語テンプレートを使う場合は、言語 **日本語 (ja)** の行に上記を設定する。クライアントは `auth.languageCode = 'ja'` を送る。英語テンプレートのみの場合は英語側にも同文を入れるか、日本語ローカライズを追加する。

   Identity Platform を GCP コンソールで直接触る場合: [SMS テンプレート](https://console.cloud.google.com/customer-identity/sms-templates) でも同等の文言を設定できる。

### 料金の目安

- 日本向け SMS: [Identity Platform 料金](https://cloud.google.com/identity-platform/pricing) の Japan (JP) 行（執筆時点の公表例: **$0.03 / SMS**）。**日次10通まで無料**の枠あり。
- GCP **予算アラート**を設定すること（請求の急増防止）。

## 2. Wrangler / Pages シークレット

プロジェクトルートで設定（本番 Pages の環境変数でも可）:

```bash
npx wrangler pages secret put FIREBASE_PROJECT_ID
npx wrangler pages secret put FIREBASE_WEB_API_KEY
npx wrangler pages secret put FIREBASE_APP_ID
npx wrangler pages secret put FIREBASE_AUTH_DOMAIN
# 任意（未設定時はデフォルト consent バージョンをコード側で使用）
npx wrangler pages secret put SIM_SMS_CONSENT_VERSION
```

| 変数 | 説明 |
|------|------|
| `FIREBASE_PROJECT_ID` | JWT 検証用（サーバー必須） |
| `FIREBASE_WEB_API_KEY` | クライアント Firebase 初期化（公開前提） |
| `FIREBASE_APP_ID` | Web アプリ ID |
| `FIREBASE_AUTH_DOMAIN` | 通常 `{projectId}.firebaseapp.com` |
| `SIM_SMS_CONSENT_VERSION` | 同意文バージョン ID（例: `2026-07-25-ja-v2`） |

ローカル開発は `.dev.vars` に同じキーを記載（git にコミットしない）。

## 3. D1 マイグレーション

```bash
npm run db:migrate:local   # 開発
npm run db:migrate:remote  # 本番（デプロイ前）
```

`migrations/0057_sim_phone_verification.sql` を適用。

## 4. デプロイ順

1. Firebase 設定 + Wrangler シークレット
2. D1 マイグレーション
3. `npm run deploy`（Pages）
4. テスト番号で E2E → 実番号 1 件でスモーク

## 5. 動作確認チェックリスト

- [ ] 未ログイン → ログインへリダイレクト
- [ ] ログイン済み・未電話認証 → FDS 依頼不可、モーダルで認証
- [ ] 認証から1年経過 → `expired: true`、FDS 依頼不可、再認証で `verified: true`
- [ ] 同意なしでは SMS 送信ボタン無効
- [ ] テスト番号で OTP → `POST /api/simulation/phone-verification/complete` 成功
- [ ] FDS 依頼 `POST /api/simulation/fds-requests` 成功
- [ ] 同一 `+81` 番号を別ユーザーが登録 → 409
- [ ] 1日10回超の consent / complete → 429
- [ ] legacy.html の旧予約は電話認証不要

## 6. レート制限と番号の一意性

- **1ユーザーあたり1日10回まで**（日本時間の日付でリセット）。SMS 送信前の `POST phone-verification/consent`（`phone_e164` 付き）と、コード確定の `POST phone-verification/complete` のそれぞれで1回ずつカウントします。
- 上限超過時は **429**、`code: SIM_PHONE_DAILY_LIMIT`。
- **ScienceHUB 全体で同一 `phone_e164` は1アカウントのみ**（DB の部分ユニークインデックス `idx_users_phone_e164` + サーバー側チェック）。別ユーザーが既に登録している番号は **409**、`PHONE_ALREADY_REGISTERED`。
- `GET phone-verification/config` の `daily_attempt_limit`（現在 10）を UI 表示に利用可能。

## 7. 有効期限と再認証

- 電話認証は `sim_phone_verified_at` から **365 日間** 有効（サーバー定数 `SIM_PHONE_VERIFICATION_TTL_MS`）。
- 期限切れのユーザーは `phone-verification/status` で `verified: false`, `expired: true`。
- FDS 依頼 `POST fds-requests` は `requireSimPhoneVerified` で拒否（403 `SIM_PHONE_NOT_VERIFIED`）。
- 再認証は通常の SMS フローと同じ（期限切れ後は `complete` が新しい `sim_phone_verified_at` を記録）。

## 8. 番号変更（将来）

現状は再認証まで番号変更 API なし。番号を変える場合も期限切れ後の再認証フローで上書き可能（別ユーザーが同一番号を持つ場合は 409）。

## 9. reCAPTCHA のコンソールメッセージ（トラブルシュート）

電話認証で SMS を送るとき、Firebase が **ボット対策の reCAPTCHA** を Google の iframe で動かします。開発者ツールに次のようなログが出ることがあります。

| メッセージ | 意味 |
|------------|------|
| `Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.` | **多くの場合は致命傷ではない。** Enterprise 用の設定が無いので、通常の reCAPTCHA v2 にフォールバックしている、という Firebase 側の通知です。 |
| `requestStorageAccess: Permission denied` | reCAPTCHA の iframe が **第三者 Cookie / ストレージ** を使おうとして、ブラウザが拒否したログです。Safari の「サイト越えトラッキングを防ぐ」、Brave、厳格な拡張機能、プライベートモードなどで起きやすいです。 |

### 対処の優先順位

0. **操作順序** — モーダルを開いたら reCAPTCHA が先に出ます。**チェック → 番号入力 → 送信** の順。送信を押してから初めて reCAPTCHA が出る旧挙動は修正済みです。
1. **URL に `:443` を付けない** — `https://s.mmh-virtual.jp/` で開く。`:443` 付きで開いていた場合、ページ読み込み時に正規 URL へリダイレクトします。
2. **表示型 reCAPTCHA** — UI は「私はロボットではありません」チェックボックスを表示します。チェックしてから「認証コードを送信」を押してください。
3. **別ブラウザ** — まず Chrome（通常ウィンドウ）で試す。
4. **Firebase 承認済みドメイン** — `s.mmh-virtual.jp` が Authentication → Settings → Authorized domains に入っているか確認。
5. **App Check** — Enterprise を有効にしたがキー未設定だと上記の Enterprise 失敗ログが出続けます。未整備なら App Check を一旦オフにするか、[reCAPTCHA Enterprise を正しくリンク](https://firebase.google.com/docs/app-check)する。
6. **テスト番号** — コンソールの「テスト用の電話番号」なら SMS 料金なしで reCAPTCHA 通過後に固定コードで進められます。

SMS 送信そのものが `auth/captcha-check-failed` などで失敗する場合は、上記のあと Firebase Authentication のログとブラウザの Cookie 設定を確認してください。

### SMS が届かないが画面がコード入力に進んだ場合

ブラウザの Network で `sendVerificationCode`（または同等）のレスポンスに **`sessionInfo`** がある場合、**ScienceHUB / reCAPTCHA は通過済み**で、Firebase が SMS 送信キューに載せた状態です。届かない原因は多くが **配信側** にあります。

| 確認項目 | 内容 |
|----------|------|
| SMS region policy | Authentication → Settings → **SMS region policy** で **Allow** し **Japan (JP)** を含める。[FAQ の地域一覧](https://firebase.google.com/support/faq#phone-auth-regions) も参照。 |
| Blaze + 請求 | Spark では本番 SMS 不可（2024-09 以降）。 |
| テスト番号 | Phone → **テスト用の電話番号** で固定コードが通るか（通ればアプリ実装はほぼ OK）。 |
| キャリアブロック | 日本キャリアは **海外事業者 SMS 拒否** で Firebase OTP が落ちる事例が多い（ブログ・サポート事例。公式のキャリア別保証は各社要確認）。 |
| GCP ログ | [Activity logging](https://cloud.google.com/identity-platform/docs/activity-logging) で `SendVerificationCode` の成否。エラー 39 等は [Firebase サポート](https://firebase.google.com/support) 向け。 |
| `requestStorageAccess` | reCAPTCHA iframe のログ。**`sessionInfo` が返っていれば今回の未着の主因ではない**ことが多い。 |

再送は UI の「認証コードを再送信」（60 秒クールダウン）。短時間に何度も送ると Firebase 側でレート制限されます。
