# コンテスト entry — ローカル E2E

本番 URL への未認証アクセスはログインへリダイレクトされるため、E2E はローカルで実行します。詳細は [contest-e2e.md](./contest-e2e.md)（#101 で追加）を参照。

## contest-entry 用クイック手順

1. `npm run db:migrate:local`
2. `loginAsAdmin()` でセッション取得（管理者は全アプリにアクセス可）
3. `page.goto("/apps/contest-entry/")` — 申請一覧 UI を検証

```bash
npm run test:contest
```

`tests/contest/contest-entry-auth.spec.ts` でリダイレクトとログイン後アクセスを確認します。
