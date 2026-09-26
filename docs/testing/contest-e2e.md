# コンテスト機能 — ローカル E2E 認証

本番 (`s.mmh-virtual.jp`) の OAuth テスト用アカウントはリポジトリに含めません。Playwright は **ローカル `wrangler pages dev`** で認証を完結させます。

## 前提

```bash
cp .dev.vars.example .dev.vars   # 初回のみ
npm run db:migrate:local
npm run test:contest             # または個別 spec
```

`playwright.config.ts` の `webServer` が port 8788 で Pages を起動します（`AGENTS.md` の D1/R2 オーバーライドが必要な環境では手動で `npm run dev` を起動し `reuseExistingServer` を利用）。

## 管理者（参加申請一覧・メンバー一覧）

ローカル D1 の既定管理者:

| 項目 | 値 |
|------|-----|
| ユーザー名 | `admin` |
| パスワード | `mmh@2048@5431` |

Playwright では `tests/website-publish/helpers.ts` の `loginAsAdmin()` が `/api/auth/login` に POST し、セッション Cookie を付与します。

未認証で `/apps/contest-management/applications` にアクセスすると `/login/?next=...` へリダイレクトされます（本番と同様）。

## 一般ユーザー

`/login/?tab=signup` または API `POST /api/auth/signup` でゲスト作成（`tests/contest/helpers.ts` の `signupGuest`）。

## 関連 Issue

- #101 参加申請一覧（admin）
- #107 メンバー一覧
- #106 contest-entry 認証
