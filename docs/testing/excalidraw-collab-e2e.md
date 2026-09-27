# Excalidraw（ホワイトボード）共同編集 E2E

## 前提

1. `npm run db:migrate:local`
2. 共同編集 DO を載せた Playwright 設定を使う（通常の `playwright.config.ts` だけでは `EXCALIDRAW_COLLAB` が 503 になり得る）

```bash
npm run test:excalidraw
```

`playwright.excalidraw.config.ts` の `webServer` は `dev:all` と同様に  
`--do EXCALIDRAW_COLLAB=ExcalidrawCollabRoom@excalidraw-collab` を付与する。

手動でサーバーを起動する場合:

```bash
npm run db:migrate:local
npm run dev:all -- --ip 127.0.0.1 --port 8788 --d1 sciencehub_db=sciencehub-db --r2 sciencehub_files=sciencehub-files
```

## テスト

| ファイル | 内容 |
|----------|------|
| `tests/excalidraw/collab-delete-rollback.spec.ts` | 削除ロールバックの再現（reconcile + D1 上書き） |

調査レポート: [excalidraw-collab-delete-rollback-2026-09-27.md](./excalidraw-collab-delete-rollback-2026-09-27.md)
