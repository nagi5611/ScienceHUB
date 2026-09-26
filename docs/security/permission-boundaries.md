# 権限境界（多層防御）ガイド

ScienceHUB のアプリ API では、次の 4 層でアクセスを制御します。

1. **認証** — `requireUser()`（未ログインは 401）
2. **アプリアクセス** — `canUserAccessApp()` / `requireAppAccess()`（グループ・ロール、管理者はバイパス）
3. **データ所有権** — `WHERE user_id = ?` または行の `user_id` 照合（他人の ID は 404）
4. **管理者操作** — `userHasAdminRole` またはアプリ固有の管理権限

## 新規 API チェックリスト

- [ ] `requireUser()` または `requireAppAccess()` を呼ぶ
- [ ] 管理ルートは `admin` セグメント等で分岐し、管理アプリ slug を要求する
- [ ] 一覧 API は所有者でフィルタする
- [ ] 更新・削除は所有権または管理権限を再確認する
- [ ] 401 / 403 / 404 を用途に合わせて返す

## コンテスト API の例

- ユーザー API: `contest-entry` アプリアクセス + `userId` でスコープ
- 管理 API: `contest-management` アプリアクセス（`functions/api/contest/[[path]].ts`）

## E2E

ローカル Playwright: `npm run test:contest`（`tests/contest/permission-boundaries.spec.ts`）。

## 関連 Issue

- #102 権限境界 E2E
- #103 セキュリティ強化（ロギング等）
