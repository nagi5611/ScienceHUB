# コンテスト entry — ローカル E2E

本番 URL への未認証アクセスはログインへリダイレクトされるため、E2E はローカルで実行します。詳細は [contest-e2e.md](./contest-e2e.md)（#101 で追加）を参照。

## contest-entry 用クイック手順

1. `npm run db:migrate:local`
2. `loginAsAdmin()` でセッション取得（管理者は全アプリにアクセス可）
3. `page.goto("/apps/contest-entry/")` — 申請一覧 UI を検証

```bash
npm run test:contest
npm run test:contest-entry          # 申請フォーム・STL・展示カードプレビューなど
npm run test:contest-entry:display-card
```

`tests/contest/contest-entry-auth.spec.ts` でリダイレクトとログイン後アクセスを確認します。展示カードのオーバーレイは `tests/contest-entry/display-card-preview.spec.ts`（`SAVE_DISPLAY_CARD_SCREENSHOT=1` で `test-results/contest-display-card-preview-sample.png` を出力可）。

テンプレート本体は `public/apps/contest-entry/images/display-card-template.svg`（表示は PNG）。枠線を直すときは SVG を編集し、必要なら `npm run contest:display-card-template -- --png` で PNG を再生成（日本語の見え方は環境依存のため、崩れる場合は PNG を手動差し替え）。文字の重ね位置は `display-card-preview.js` の `DISPLAY_CARD_LAYOUT` を調整する。
