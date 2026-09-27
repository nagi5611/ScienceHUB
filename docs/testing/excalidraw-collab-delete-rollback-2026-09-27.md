# ホワイトボード（Excalidraw）共同編集 — 削除ロールバック調査

**日付:** 2026-09-27  
**対象:** `/apps/excalidraw/`（Pages API + `workers/excalidraw-collab` Durable Object）

## 概要

共同編集中に一方が図形を削除しても、しばらくして **削除前の図形が再表示される** 事象を調査した。  
原因は **Excalidraw 要素マージ後に `isDeleted` 要素を配列から落としていること** と、**クライアント／D1 がフルシーンを上書き保存していること** の組み合わせである。  
クライアント・DO・API で **同一の `reconcileElements` ロジック** が使われている。

## E2E 結果

コマンド: `npm run test:excalidraw`（2026-09-27、ローカル Windows）

| テスト | 結果 | 意味 |
|--------|------|------|
| `DO と同一の reconcileElements で削除が古い版により復活する` | **PASS** | 削除後の DO 状態（要素なし）に、古い版の非削除要素をマージすると復活する |
| `D1: 削除済みシーンのあと古い PUT が上書きすると要素が復活する` | **PASS** | D1 の `scene_json` が last-write-wins で古いフルシーンに戻る |

### 双方向 WebSocket E2E について

2 クライアントの raw WebSocket で DO 経由のロールバックを再現するケースも実装したが、  
Playwright 実行環境では **`WebSocket error` で接続失敗**（`page.evaluate` 内、`/api/excalidraw/collab`）。  
同一設定でエディタを開くと `#peers-status` が **「再接続中…」** になり、ローカル DO バインディングが不安定な可能性がある。

**事実:** 上記 2 テストは API／`reconcileElements` 経由で再現に成功。  
**推測:** 本番（DO デプロイ済み）では WebSocket E2E も通る可能性があるが、本調査では未確認。

## 根本原因

### 1. リアルタイム同期（主因）

`reconcileElements` は version / versionNonce でマージしたあと、**`isDeleted` 要素を結果から除外**する。

```69:69:public/js/excalidraw-collab-utils.js
  return [...map.values()].filter((el) => !el.isDeleted);
```

Durable Object 側も同じ実装:

```93:93:workers/excalidraw-collab/src/index.ts
  return [...map.values()].filter((el) => !el.isDeleted);
```

**再現シーケンス（E2E で確認）:**

1. クライアント A が削除 → 要素は `version: 2`, `isDeleted: true` で WS 送信
2. DO がマージ → マップから削除扱いで **ID ごと消える**（配列は空）
3. クライアント B がまだ古い `version: 1`, `isDeleted: false` を **フルシーン** で `broadcastScene`（200ms デバウンス、`public/apps/excalidraw/app.js`）
4. DO の `reconcileElements(空, [古い要素])` → **要素が再登録**
5. DO が `scene` を全員にブロードキャスト → A/B の UI がロールバック

関連コード:

- クライアント送信: `public/apps/excalidraw/app.js` — `handleLocalChange` → `broadcastScene()`（`SCENE_BROADCAST_MS = 200`）
- WS 受信マージ: `public/js/excalidraw-collab-utils.js` — `applyRemoteSceneToApi` → `reconcileElements`
- DO 受信: `workers/excalidraw-collab/src/index.ts` — `webSocketMessage` → `reconcileElements` → `broadcast`

**要点:** 削除は「高 version の tombstone」としてマージすべきところ、tombstone を **状態から除去**しているため、古い非削除コピーが **新規要素として再投入**できる。

### 2. D1 永続化（副因・再読み込み時）

`PUT /api/excalidraw/notes/:id/scene` は **フル `scene_json` 置換**（マージなし）。

```381:404:functions/lib/excalidraw-notes.ts
export async function saveAccessibleNoteScene(
  ...
  const sceneJson = serializeScene(sceneInput);
  ...
       SET scene_json = ?, updated_at = ?
```

共同編集者の **遅れた `persistToServer`（800ms デバウンス）** や、別タブの古い状態保存が、  
削除後のシーンを **生きた要素付きで上書き**する（E2E 2 件目で再現）。

`persist` は DO に `reconcileElements` でマージするが（`workers/excalidraw-collab/src/index.ts` `/persist`）、  
D1 本体はマージされない。再接続時の `seed`（`functions/api/excalidraw/[[path]].ts`）は DO が空のときのみ D1 から読む。

### 3. 接続時 seed

WebSocket 接続ごとに D1 シーンを DO へ `seed` する（DO が空のときのみ）。  
通常のロールバックの直接原因ではないが、D1 が古い場合の **初回同期ズレ**要因になり得る。

## 実装済み（2026-09-27）

1. **`reconcileElements`** — `public/js/excalidraw-collab-utils.js` と `workers/excalidraw-collab/src/index.ts` で tombstone（`isDeleted: true`）をマージ結果に保持（Excalidraw は `isDeleted` を描画側で処理）。`visibleElements` は必要時の表示用ヘルパーとして追加。
2. **broadcast 抑制** — `public/apps/excalidraw/app.js` でリモート適用開始時に `broadcastTimer` をクリア、`broadcastScene` は `applyingRemote` 中は送信しない。
3. **D1 保存マージ** — `functions/lib/excalidraw-reconcile.ts` を追加し、`saveAccessibleNoteScene` / `saveSharedNoteScene` で既存 `scene_json` と `reconcileElements` してから UPDATE。
4. **E2E** — `tests/excalidraw/collab-delete-rollback.spec.ts` を修正後の期待値に更新。

## 修正方針（参考・上記で対応）

優先度順の案:

1. **`reconcileElements` の tombstone 保持**  
   - マージ用の内部状態では `isDeleted: true` の要素を **ID ごと残す**（表示用フィルタのみ別関数）  
   - 古い `version` の非削除コピーは tombstone より劣後させる（Excalidraw 公式 collab に近い）

2. **フルシーン broadcast の抑制**  
   - リモート適用中（`applyingRemote`）は送信しない／送信前に `latestElements` を DO 版と再 reconcile  
   - または変更差分のみ送信（工数大）

3. **D1 保存時マージ**  
   - `saveAccessibleNoteScene` で既存 `scene_json` と `reconcileElements` してから UPDATE

4. **Design アプリ**  
   - 別実装だが、同種の共同編集がある場合は同様のマージ規則を確認

## 追加した成果物

- `tests/excalidraw/collab-delete-rollback.spec.ts`
- `tests/excalidraw/helpers.ts`
- `playwright.excalidraw.config.ts`
- `npm run test:excalidraw`
- 本ドキュメント、`docs/testing/excalidraw-collab-e2e.md`

## 出典

- リポジトリ内ソース（上記パス）
- ローカル E2E 実行ログ（`npm run test:excalidraw`, 2026-09-27）
