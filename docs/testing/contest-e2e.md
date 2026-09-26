# コンテスト管理 — メンバー一覧のローカルテスト

本番では Google/Microsoft ログインが必要なため、メンバー一覧の自動テストは **ローカル Playwright + 管理者セッション** で行います。

## 手順

1. [contest-e2e.md](./contest-e2e.md) の環境準備（#101）
2. `loginAsAdmin()` 後に `/apps/contest-management/` を開く
3. メンバー一覧タブの表示・検索を手動または spec で確認

```bash
npm run test:contest
```

`tests/contest/contest-management-auth.spec.ts` で未認証リダイレクトと管理者アクセスを確認します。
