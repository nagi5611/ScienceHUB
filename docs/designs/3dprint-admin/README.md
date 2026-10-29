# Handoff: 3Dプリント依頼 管理コンソール（3dprint-admin）

## Overview

松山南高校 自然科学部 / 3Dモデル班の ScienceHUB 内アプリ `/apps/3dprint-reservation/` に付属する **管理者向け画面**。
生徒が申請した「3Dプリントの依頼（STL提出）」と「予約（時間確保）」を、担当者（金田・田村・藤原 など）が確認して **確定 / 却下** し、
日々のシフト・メンバー・外部連携（Discord Webhook / Google カレンダー）を管理する。

解決すること:

- 4週カレンダーで「どの日に依頼・予約が何件あるか」を一望し、日付クリックでその日の申請を全件確認
- 依頼（16:30〜20:00 を丸ごと占有）と予約（時間だけ確保）を **視覚的に混同させない**
- 却下理由を定型文から1タップで選び、申請者へのメッセージを添えて返す
- 曜日 × 週数でシフトを一括設定（例：毎週月曜を4週間ぶん田村に入れる）
- 印刷担当者の追加・改名・削除（削除時はその人のシフトを自動で「休み」に）
- Discord 通知 / Google カレンダー連携の設定入力

---

## About the Design Files

このバンドルの HTML / CSS / JSX は **HTML で作られたデザインリファレンス（高忠実度プロトタイプ）** です。
本番コードとしてそのまま貼るものではなく、**ターゲットのコードベース（React / Next.js / Vue / Rails + Hotwire など）の既存パターン・ライブラリで再現する** ことが目的です。環境がまだない場合は React + TypeScript（Vite か Next.js）を推奨します。手本とした予約フォーム側アプリも React 18 で書かれています。

参考実装は React 18（UMD）＋インライン Babel で書かれています。`<script type="text/babel">` を本番に持ち込まないこと。各 `admin-admin/*.jsx` は **1コンポーネントファイルとしてそのまま移植できる粒度** で分割してあります（`ui / daylist / review / settings / App`）。`admin/core.js` はフレームワーク非依存のドメインロジックなので、そのまま（もしくは TypeScript の `domain.ts` に）移植できます。

> **重要**: 「管理側のみ」のデザインです。生徒側の申請フォーム（4週カレンダー＋タイムラインで時間を選ぶ画面）は **このバンドルに含まれていません**。`App.jsx` のヘッダーにある「申請フォーム」リンクは、既存の `/apps/3dprint-reservation/` を指す前提のプレースホルダです。

---

## Fidelity

**High-fidelity（hifi）**。色・タイポグラフィ・余白・角丸・影・状態・マイクロアニメーションまで確定値です。
既存ライブラリで再現する場合も、ピクセル単位でこの見た目に合わせてください。
トークンは **ScienceHUB デザインシステム（`colors_and_type.css`）が正** で、本プロトタイプは同トークンを `admin/admin.css` の `:root` に転記して使用しています（§Design Tokens に全値）。

---

## Screens / Views

### 1. 全体レイアウト（1ページ）

- **Header（sticky / 全画面共通）**: 高さ 60px（min-height）、白 `#fff`、下線 1px `#e2e5ea`、`shadow-sm`、`z-index: 200`。
  - 左: 部エンブレム 30px 円形（`assets/icon-192.png`、1px 線）＋「ScienceHUB」15px/700 ＋ 区切り線 1px×16px ＋「3Dプリント管理」12.5px/500 `#5e6778`。
  - 続いて「管理者」ピル（9.5px/700、`#d96a0c` on `rgba(243,128,32,.1)`、1px `rgba(243,128,32,.35)`、角丸999）。
  - 右（gap 8px）: 操作者セレクト（`操作者 [金田 ▾]`、10.5px ラベル＋11.5px/700 の値、1px 線、角丸6、内側 padding 3px 7px）→「CSV出力」ゴーストボタン →「申請フォーム」ゴーストボタン →「設定」ボタン（1px 線・白地。**1080px以上の常設サイドバーがある時は非表示**）→「承認待ち N」チップ。
- **Main**: 最大幅 **1360px**、横 padding 24px、上 20px / 下 40px。
- **Page head**: バッジ「校内設備 / 自然科学部 3Dモデル班」（11px/600、オレンジ淡地、角丸999）／`h1`「3Dプリント 依頼管理」22px/700 `letter-spacing:-.015em` `#101624`（上 7px / 下 3px）／説明 11.5px/400 `#5e6778` 行間1.65（`依頼` `予約` の2語だけ `#d96a0c` 700）。
- **Workspace（2カラム）**: `grid-template-columns: minmax(0,1fr) 396px; gap:16px; align-items:start`。
  - 左カラム `.col-main`: カレンダー → 日付サマリ → この日の申請（縦に 14px 間隔）
  - 右カラム `.col-side`: **常設サイドバー**（`position:sticky; top:72px; max-height:calc(100vh - 92px)`、内部 `.side-body` がスクロール）
  - **1080px 以下**は1カラム化し、サイドバーを隠して「設定」ボタン＋ドロワー（下から出るシート）に切替。
- **Footer**: 白地・上線1px、エンブレム32px＋「松山南高校 自然科学部 / 3Dモデル班」11.5px/700＋注記10px。右に「申請フォーム（生徒用）」「diorama@mmh-virtual.jp」「データを初期化」。

### 2. Calendar（主役）

- カード: 白、1px `#e2e5ea`、角丸12、`shadow-sm`。
- ヘッダー `.cal-head`（padding 12/16/10、下線1px）:
  - 月表示 `2026年 11月` 17px/700 `letter-spacing:-.02em`＋「4週表示」ピル（10px/600、オレンジ淡地）
  - サブ行（10.5px `#5e6778`）: `11/1〜11/28 ／ 依頼 12件 ・ 予約 18件`
  - 右: `‹`「今日」`›`（高さ28px、1px 線、角丸6。**4週＝28日ずつ移動**）
- **表示ロジック**: 選択日を含む週（日曜始まり）を第1週とし、4週（28日）を表示。月境界をまたぐ場合は `10月 → 11月`。
- 曜日行（独立グリッド、7列、gap 6px、下 padding 6px）: 9.5px/700 `#8a92a1`。日曜 `#b4776b`、土曜 `#7c8ba4`。
- 日付グリッド: 7列 × 4行、`grid-auto-rows: 104px`、gap 6px。
- **日セル（`button`）**: padding 7/8/8、角丸8、1px `#e2e5ea`、白、`display:flex; flex-direction:column; gap:5px`。min-width 0・overflow hidden。
  - 1行目: 日付数字（20px 円、11.5px/700 tabular）＋右端に担当者（8.5px/700 `#d96a0c` on オレンジ淡地、角丸3、padding 0 4px、max-width 60px、省略）。休みの日は `休`（`#f2f4f7` 地に `#8a92a1`、600）。
  - 2行目〜: **依頼 / 予約の2行**（各 9.5px/600 `#5e6778`、行高1.55）
    - 左に 6px 角丸1 のマーク（依頼＝`#f38020`、予約＝`#3b74e0`）、ラベル、右端に件数（10px/700）
    - ラベル色: 依頼 `#5e6778`／件数 `#d96a0c`。予約 `#5e6778`／件数 `#1f4fae`。
    - **0件はグレーアウト**（文字 `#b9c0ca`、マーク `#dfe3e9`）
  - 最下部（`margin-top:auto`）: 申請があれば `申請中 N`（8.5px/700 `#9a4a07` on `#fff7ed`、1px `#fbc998`、角丸3）
  - 状態: hover で地 `#f8f9fb` ＋線 `#c9ced6`。選択中は **1.5px `#f38020` ＋ `box-shadow: inset 0 0 0 .5px #f38020, 0 0 0 3px rgba(243,128,32,.1)`**、日付円は `#f38020` 地・白文字。今日は日付円 `#101624` 地・白文字。担当なしの日は地 `#fafbfc`、数字 `#8a92a1`。
- 凡例（下線1px、padding 9/16/11）: 「依頼」バッジ＋「データを提出して印刷枠を使う」、「予約」バッジ＋「プリンターの時間だけ確保」、右寄せで「日付をクリックすると、その日の申請がすべて下に並びます」（10px `#5e6778`）。

### 3. DayStrip（日付サマリ / 稼働率なし）

- カード（padding 10/16、角丸12、`shadow-sm`）を横並び。
- 左: `11/4` 20px/700＋`水` 12px/700 `#5e6778`＋（今日なら）「今日」チップ。
- 中: **依頼バッジ＋件数**（15px/700 `#d96a0c`）＋`申請中 N`（9.5px/700 `#9a4a07` があれば）／**予約バッジ＋件数**（15px/700 `#1f4fae`）／区切り線のあと `担当 藤原`（10.5px、値12px/700）。
- 右: 「シフト・メンバー」ボタン（secondary / 28px高）。

### 4. DayList（その日の申請を全件・種別で分離）

- カードヘッダー: 「この日の申請」13px/700＋`11/4（水） ・ 全 3件（依頼 1 / 予約 2）`（10.5px `#5e6778`、tabular）。過去日は右に「過ぎた日」チップ。
- 本文 `.dgroups`（padding 12/16/16、gap 12px）に **2つのグループを縦に**:
  - **依頼グループ** / **予約グループ**（`.dgroup`、1px 線、角丸8、overflow hidden）
    - グループ見出し: 背景 `rgba(243,128,32,.1)`＋線 `rgba(243,128,32,.35)`（依頼）／`#eff5ff`＋`#bcd3fb`（予約）。中身は 左から `KindBadge` → `N件`（11px/700）→ `申請中 N`（あれば）→ 説明文（10px `#5e6778`、1行省略: 依頼「STLを提出して 16:30〜20:00 の枠を丸ごと使う」／予約「プリンターの時間だけを確保（データ提出なし）」）→ 右端に（申請中2件以上なら）「まとめて確定」ボタン。padding 8/12。
    - **行（`.drow`）**: `grid-template-columns: 56px 92px minmax(0,1fr) auto; gap:10px; padding:8px 12px`、行間 1px `#eef0f3`。
      1. 時刻: 開始 11.5px/700 `#101624`（上）／終了 9.5px `#8a92a1`（下、tabular）
      2. 種別＋機種: `KindBadge`（依頼＝オレンジ枠・淡地、予約＝青枠・淡地、10px/700、左に6px角丸1のマーク）の下に `▪ KE` / `▪ CC`（9px/600 `#8a92a1`、ドットは依頼/予約ではなく **機種色** KE=`#f38020` / CC=`#3b74e0`）
      3. 作品名 12px/600 `#101624`（1行省略）＋サブ行 9.5px `#5e6778`（`南野 湊`・`2年03HR・12番`・`2-3_南野_12.stl`・`メモあり` を `·` 区切り）
      4. 右: 状態タグ（申請中＝`#fff7ed`/`#fbc998`/`#9a4a07`、確定＝`#eef9f2`/`#bfe6cf`/`#177a43`、完了＝`#f8f9fb`/`#e2e5ea`/`#8a92a1`、却下＝グレー＋取り消し線、いずれも 9.5px/700、角丸3、padding 0 5px）＋申請中のみ「確定」(orange soft)「却下」(hoverで warn 色)＋「›」詳細。
    - 0件のグループは「この日の依頼はありません。」（padding 14/12、中央、10.5px `#8a92a1`）。
  - **却下済み**は `<details>` 折りたたみ（破線枠、`却下 N件を表示`、開くと同じ行を `.is-rejected`＝opacity .62 で表示）。

### 5. 右サイドバー（常設 / 3タブ）

- カード（角丸12、`shadow-sm`）、内部は `sticky`。上に3タブ（`.set-tabs`、下線1px、各タブ `flex:1`、11.5px/600、選択中は `#d96a0c` 文字＋下線2px `#f38020`）。以下 `.side-body`（padding 12/14/16、縦スクロール）。

#### 5-a. シフトタブ（一括設定＋個別調整）
- 説明 9.5px `#8a92a1`。
- **曜日**: 7分割セグメント（`.wd-pick`、地 `#f8f9fb`、1px 線、角丸6、padding 3px）。各ボタン 11.5px/700 `#5e6778`、選択中は `#f38020` 地・白（日曜は `#b4776b`、土曜は `#7c8ba4`）。
- **開始する週**: セグメント4択（`今週 10/25` / `来週 11/1` / `+2週` / `+3週`）。ボタンは2段（ラベル11px/600＋日付8.5px `#8a92a1`）、選択中は白地＋`shadow-seg`＋`#d96a0c`。
- **何週間ぶん**: `1週 / 2週 / 4週 / 8週` の小ボタン＋数値入力（幅54px、tabular、1〜52）。
- **設定**: セグメント2択「シフトに入れる / 入れない（休み）」。
- **担当**: メンバーを丸ピルで選択（`◯ 金田`、選択中はオレンジ枠＋淡地＋`#d96a0c`）。「入れない」選択時は非表示。
- チェックボックス「すでに担当が入っている日は変更しない」。
- **プレビュー `.plan-preview`**: 地 `#f8f9fb`、1px 線、角丸8、padding 9/10。見出し「適用される日 N日」＋（あれば）`既存 N日`（warn チップ）＋`過去 N日は除外`（グレーチップ）。日付チップを flex-wrap（最大高112pxでスクロール）で列挙し、`10/26 (月) 田村` の形（10px、白地、1px 線、角丸3）。**過去日は適用対象から自動除外**。
- **適用ボタン**: primary、「N日を適用」（対象0なら disabled）。
- 区切り線のあと **個別調整グリッド**: 2週間（平日のみ最大10行）。行 = `10/26 月`（10.5px/700）＋ メンバー＋「休」の4分割セグメント（`.srow-opts`、9.5px/700、選択中は白地＋影＋`#d96a0c`）。ヘッダーに `‹ 前 / 今日 / 次 ›` で14日ずつ移動。

#### 5-b. メンバータブ
- 説明: 「印刷担当者。シフトの選択肢と『操作者』にそのまま出ます。削除するとその人のシフトは『休み』になります。」
- 一覧 `.mem`（1px 線、角丸6、padding 7/9）: 頭文字アバター26px円（オレンジ淡地＋`#d96a0c` 12px/700）／名前 12px/700＋`シフト N日 ・ 処理 N件`（9.5px `#8a92a1`）／右に「変更」「削除」（25px高の mini ボタン、削除は hover で warn 色。**残り1人になると削除は disabled**）。
- 「変更」でインライン入力に変わり、Enter/blur で確定・Escape でキャンセル。
- 下部 `.mem-add`: テキスト入力（placeholder「名前を入力（例：佐々木）」、maxLength 12）＋「追加」primary。Enter でも追加。

#### 5-c. 外部連携タブ
**Discord 通知**（`.intg`、1px 線、角丸8、padding 12、内部 gap 12）
- 見出し「Discord 通知」12.5px/700＋状態ピル（`有効`/`URL未設定`/`無効`、9px/700、角丸999、緑/橙/グレー）＋右端トグルスイッチ（34×19px、ON で `#f38020`、ノブ15px白＋影）。
- 「Webhook URL 必須」: 入力（`input.mono` 等幅11px、高さ34px、placeholder `https://discord.com/api/webhooks/123.../abc...`）。補足文「Discordの『サーバー設定 → 連携サービス → ウェブフック』で作成したURLを貼ります。」
- 形式が `^https://discord(app)?\.com/api/webhooks/\d+/[\w-]+$` に合わない場合、warn ノートで「URLの形式が違います」。
- 「通知するタイミング」: チェック3つ（新しい申請 / 確定したとき / 却下したとき）、`.chk`（1px 線、角丸6、11px、13px の checkbox、accent-color オレンジ）。
- 「メンション（任意）」: 入力（placeholder `@here  /  <@&1234567890>`）。
- フッター: 「テスト送信」secondary（URL 不正なら disabled）＋「保存は自動です。」
- **テスト送信の実装**: `fetch(webhook, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({content: mention + ' ScienceHUB 3Dプリント管理のテスト通知です。', username:'ScienceHUB 3Dプリント'})})` → 200 系なら「Discordへ送信しました」。失敗時は HTTP ステータスをトーストに出す。

**Google カレンダー**
- 同じ構造。状態ピルは `有効`/`ID未設定`/`無効`。
- 「カレンダーID 必須」: placeholder `xxxx@group.calendar.google.com`。検証は `…@(group.)calendar.google.com` か20文字以上のID。
- 「予定タイトルの書式」: placeholder `[3Dプリント] {title}`（`{title}` `{who}` `{machine}` が置換される旨の補足）。
- 2カラム: 「所要時間」セレクト（10/15/20/30/60/90/120分）、「登録する時点」セレクト（申請が届いた時点 / 確定した時点）。
- フッター「接続テスト」（ID 不正なら disabled）。

### 6. 申請詳細ドロワー（`ReviewSheet`）

- 幅 `min(480px,100vw)`、右から `translateX` .28s。**760px以下はボトムシート**（`border-radius:14px 14px 0 0`、最大高92vh）。
- 見出し: 作品名 16px/700＋サブ（`11/4（水）` ・ 機種名、折り返し可）。
- 本文（padding 14/18/18、gap 14px）:
  1. バッジ列: `KindBadge`＋状態タグ＋（当日・締切超過なら）warn チップ＋`申請 4日前`
  2. `dl.kv`（1px 線、角丸8、行 = ラベル78px `#5e6778` 10.5px＋値 11.5px/600）：時間（依頼「16:30〜20:00」＋`（依頼枠を丸ごと占有）`／予約「16:30〜17:30」＋所要時間）・機種（＋メーカー）・担当・申請者 `南野 湊（2年03HR・12番）`・種別（＋`STL提出あり` / `データ提出なし`）
  3. 印刷データ: 132px 高の枠（14px グリッド罫線 `#eef0f3`、中央に `STL` 破線ラベル＋「サムネイル未生成 — ブラウザで開いて確認」）。フッター行に拡張子バッジ30px・ファイル名・サイズ/更新・「DL」「開く」（ファイル無しは disabled）。
  4. 申請者の備考（tip ノート）
  5. **操作面**（§Interactions 参照）
  6. 「この申請の履歴」（操作ログのうち該当 `appId` のもの、新しい順）
- フッター固定: 「閉じる」。

### 7. 設定シート（`SettingsDialog` / 狭幅時の `Drawer`）

- 1080px 以下ではヘッダー「設定」から **下から出るシート**で同じ3タブを表示。
- 1080px 超でサイドバーが使えない状況（横幅不足・モーダル表示が必要な場面）用に、中央寄せダイアログ（`width:min(560px,100%)`、最大高86vh、角丸12、`shadow-md`）も同内容で用意。

### 8. Toast

- 右下固定（モバイルは左右12px）、`#101624` 地・白文字12px、左3px `#f38020`、角丸8、`shadow-md`、.25s で `translateY(8px)`＋フェード、表示2.4秒。右に操作名をオレンジで添える（例: `南野 湊 を確定しました 確定`）。

---

## Interactions & Behavior

### 日付選択
- 日セルクリック → `selected` 更新（localStorage `sh3d.admin.prefs.v2` に保存）→ 日付サマリと「この日の申請」が更新。
- `‹` `›` は選択日を ±28日して4週送り。「今日」で今日を選択（日付は必ず第1週に現れる）。

### 申請の操作（`ReviewActions`）
- **申請中**: 「確定する」（primary）＋「却下…」（secondary、押すと理由パネルを展開）。
  - 理由は4択のラジオカード（`STLの不備` / `サイズ超過` / `締切超過` / `時間不足`）。各カードは 11.5px/700 の見出し＋10px の説明文を内包し、選択中は 1.5px `#f38020`＋淡地＋ラジオ丸にドット。**未選択で実行すると「理由を1つ選んでください」**。
  - 「申請者へのメッセージ」textarea（200字、任意。空なら理由本文を `adminNote` に保存）。
  - 実行 → 状態を `rejected` に、`rejectReason` と `adminNote` を保存、操作ログ追加、トースト。
- **確定済み**: 「完了にする」＋「申請中に戻す」。
- **申請中以外**: 「申請中に戻す」。
- **担当者メモ**: 折りたたみ。「書く」で開き、textarea＋定型文プリセット4つ（16:20までに物理実験室へ／白PLAを使用／サポート材を剥がす／印刷後に実寸確認）。「メモを保存」で `adminNote` 更新＋ログ。
- すべての操作で `by`（操作者名）と操作ログ（`type: approve|reject|machine|shift|member|integ`）を記録。

### 一括確定
- グループ見出しの「まとめて確定」で、そのグループの申請中をまとめて approved に（依頼グループ・予約グループ単位、日別リスト／横断キュー共通）。

### シフト一括設定
- 曜日・開始週・週数・担当（または「入れない」）を選ぶと、プレビューに **適用日が即時計算**される（`weekStart(今日) + startWeek*7 + i*7 + weekday`）。
- 過去日は常に除外。`skipExisting` が ON のときは既に担当が入っている日も除外。
- 「N日を適用」で `shiftsSaved` に日付→メンバーID（null = 休み）を書き込み、ログに1行追加。
- 個別調整グリッドのセル操作は1日単位で即時保存。

### メンバー
- 追加: ID は `m + Date.now().toString(36) + random`。`shifts` の既定ローテーション（平日 `(day-1) % members.length`）に自動で組み込まれる。
- 改名: 申請の `by`（過去の処理者名）は文字列なので変わらない点に注意（必要なら ID 参照に変更）。
- 削除: そのメンバーIDのシフトを全て `null`（休み）に置換。残り1人になると削除不可。

### 連携
- 入力はすべて **即時保存**（`sh3d.admin.integrations.v2`）。「保存」ボタンは無い。
- Discord のテスト送信のみ実通信。Google カレンダーの「接続テスト」は本プロトタイプでは書式確認のみ（実装時は OAuth / サービスアカウントで `calendars/{id}` を GET し、200 を確認する）。

### CSV 出力
- 表示中の4週間（`weekStart(selected)` 〜 +27日）を出力。列:
  `日付, 曜日, 開始, 終了, 機種, 種別, 作品名, 申請者, 学年HR, 番号, 状態, 印刷データ, サイズ(MB), 備考, 担当`
- **UTF-8 BOM 付き**（`\uFEFF`）＋ CRLF。Excel でそのまま開ける。ファイル名 `3dprint_YYYY-MM-DD_YYYY-MM-DD.csv`。値に `,` `"` 改行を含む場合はダブルクォートでエスケープ。

### マイクロアニメーション（デザインシステム準拠）
- ease は全て `cubic-bezier(.2,.8,.2,1)`。hover/色 .15s、トースト .25s、ドロワー .28s。
- `prefers-reduced-motion: reduce` で全 transition / animation を停止。

### レスポンシブ
- **1180px 以下**: 変更なし（2カラム維持）。
- **1079px 以下**: 1カラム化。サイドバー非表示＋「シフト・メンバー・連携」ボタンとヘッダー「設定」を表示。
- **820px 以下**: 日セル 80px、語間 4px。**760px 以下**: 余白 12–14px、ヘッダーのクラム非表示、日セル 66px、適用日サマリは折り返し、申請行は2列グリッド（時刻/本文 ・ 種別/操作）、ドロワーはボトムシート。
- **560px 以下**: 日セル 60px、日セル内の「依頼」「予約」ラベル文字を隠してマーク＋件数のみ、フォーム2カラムを1カラムに。
- タップターゲットは 44px 以上を確保（日セル・主要ボタン・セグメントは高さ28px＋padding だが、モバイルでは行高とボタン高を拡大すること）。

---

## State Management

```ts
type Kind = 'request' | 'reserve';
type Status = 'pending' | 'approved' | 'rejected' | 'done';
type Machine = 'ke' | 'cc';

type Member = { id: string; name: string };
type Who = { name: string; hr: string; num: string };   // hr: '101'〜'309'

type Application = {
  id: string;
  date: string;            // 'YYYY-MM-DD'
  machine: Machine;
  kind: Kind;
  start: number;           // 分（16:30 = 990）。依頼は常に 990
  end: number;             // 分。依頼は常に 1200
  title: string;
  file: string;            // 依頼のみ。'' なら提出なし
  fileSize?: number;       // bytes
  note: string;            // 申請者の備考
  who: Who;
  status: Status;
  rejectReason?: 'stl' | 'size' | 'deadline' | 'time';
  adminNote?: string;      // 担当者メモ / 却下メッセージ
  by?: string;             // 最後に操作した担当者名
  createdAt?: string;      // ISO
};
```

**App の状態**

| 変数 | 型 | 役割 / 保存キー |
|---|---|---|
| `members` | `Member[]` | 印刷担当者。`sh3d.admin.members.v2` |
| `apps` | `Application[]` | 全申請。`sh3d.admin.apps.v2` |
| `selected` | `string` | 選択日。`sh3d.admin.prefs.v2` |
| `actor` | `string` | 操作者名。`sh3d.admin.prefs.v2` |
| `shiftsSaved` | `Record<string, string \| null>` | 日付→メンバーID（null=休み）。`sh3d.admin.shifts.v2` |
| `integrations` | `{discord, gcal}` | `sh3d.admin.integrations.v2` |
| `log` | `LogEntry[]` | 操作ログ。`sh3d.admin.log.v2` |
| `detail` / `detailMode` | `Application \| null` / `'reject' \| 'note' \| null` | 詳細ドロワー |
| `settingsOpen` / `settingsTab` | `boolean` / `'shifts' \| 'members' \| 'integrations'` | 設定の開閉・タブ |
| `toast` | `{text, mark} \| null` | トースト |

**派生値**
- `shifts = buildShifts(shiftsSaved)` … 140日ぶんの既定ローテーション（平日のみ、`(day-1) % members.length`）に保存値を上書き
- `staffOn(dateStr)` → 担当者名（休みは null）
- `daySummary(apps, dateStr)` → `{ all, live, requests, reserves, pending }`
- `dayOcc(apps, dateStr)` → 機種ごとの 28スロット占有配列（重複判定・空き確認に使用）
- `pendingQueue(apps)` → 申請中を「日付＋開始時刻」昇順
- `isLate(app)` → 依頼かつ当日以前（＝締切超過）

**バックエンドに移すとき**
- `apps` の CRUD を API に置換（`GET /applications?from&to`, `PATCH /applications/:id/status`, `GET/PUT /shifts`, `GET/POST/PATCH/DELETE /members`, `GET/PUT /integrations`）。
- **重複判定（同一機種・同一時間帯）はサーバー側でも必ず実行**。クライアントは楽観表示のみ。
- シフトの既定ローテーション（`buildShifts`）はデモ用。実運用ではシフトAPIの返り値をそのまま使う。
- `by` は氏名文字列ではなく **メンバーID** にし、表示時に `members` から解決するのが望ましい。
- 操作ログは追記専用テーブル（`actor_id`, `type`, `app_id`, `at`, `text`）に。
- 連携はサーバー側で実行（Webhook URL をブラウザから直接叩くと URL が漏れる）。「テスト送信」もサーバー経由のプロキシに置き換える。
- ファイルは署名付きURLへ直接アップロードし、`Application.file` に表示名、`fileKey` に実体キーを持たせる。STL のサムネイルはサーバー側で生成して差し替える。

---

## Design Tokens

`colors_and_type.css`（ScienceHUB デザインシステム）が正。`admin/admin.css` の `:root` に同値を転記済み。

**Color**

| 用途 | 値 |
|---|---|
| primary / hover | `#f38020` / `#d96a0c` |
| primary soft / line | `rgba(243,128,32,.1)` / `rgba(243,128,32,.35)` |
| bg / surface / muted | `#f5f6f8` / `#ffffff` / `#f8f9fb` |
| border / strong / hair | `#e2e5ea` / `#c9ced6` / `#eef0f3` |
| text: heading / body / muted / faint | `#101624` / `#1d2433` / `#5e6778` / `#8a92a1` |
| warn bg/line/ink/text | `#fff7ed` / `#fbc998` / `#9a4a07` / `#5c3106` |
| tip bg/line/ink/text/accent | `#eff5ff` / `#bcd3fb` / `#1f4fae` / `#1b3566` / `#3b74e0` |
| success / 確定面 / 確定線 | `#1f9d55` / `#eef9f2` / `#bfe6cf` |
| スクリム | `rgba(16,22,36,.32)` |

**依頼 / 予約の色分け（この画面の主要ルール）**

| | 文字 | 面 | 線 | マーク |
|---|---|---|---|---|
| 依頼 (request) | `#d96a0c` | `rgba(243,128,32,.1)` | `rgba(243,128,32,.35)` | `#f38020` |
| 予約 (reserve) | `#1f4fae` | `#eff5ff` | `#bcd3fb` | `#3b74e0` |

機種色は別軸: `KE = #f38020` / `CC = #3b74e0`。

**Typography**: `Inter` + `Noto Sans JP`（'Hiragino Sans' フォールバック）。本文 13px/1.6（管理画面は密度優先でDSの15pxから落としている）、見出し700、UI 600。数字は `font-variant-numeric: tabular-nums`。ページ見出し22px/700/-.015em。カレンダー月17px/700。行の主要テキスト12px。

**Spacing**: 4 / 5 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 24。コンテナ最大 1360px、横24px（モバイル12–14px）。カード間 14–16px。

**Radius**: 3（小タグ）/ 4（バッジ・kbd）/ 5（mini ボタン・シフト選択）/ 6（ボタン・入力・セグメント）/ 8（行グループ・注記・STL枠）/ 12（カード・ドロワー）/ 999（ピル・丸アバター・トグル）。

**Shadow**: `--shadow-sm: 0 1px 2px rgba(16,22,36,.05),0 1px 3px rgba(16,22,36,.04)` / `--shadow-seg: 0 1px 2px rgba(16,22,36,.12)` / `--shadow-md: 0 6px 20px rgba(16,22,36,.08)`。内側影は使わない（選択状態の `inset 0 0 0 .5px` を除く）。

**Motion**: `cubic-bezier(.2,.8,.2,1)`、.15s（hover）/ .18s（トグル）/ .25s（トースト）/ .28s（ドロワー）。

**Z-index 階層（厳守）**: header 200 → drawer scrim 210 → drawer 211 → dialog 212 → toast 300。

**固定のドメイン定数**: `DAY_START=360`（6:00）/ `DAY_END=1200`（20:00）/ `SLOT_MIN=30` / `SLOT_COUNT=28` / 受付 `SHIFT_START=990`（16:30）/ `SHIFT_END=1200` / `SHIFT_SLOTS=7`。依頼は常に受付帯全体（16:30〜20:00）を占有。

---

## Assets

- `admin/assets/icon-192.png` … 自然科学部エンブレム（「南」＋フラスコ・顕微鏡・DNA・原子）。ヘッダー30px 円形、フッター32px 円形、favicon。円形クロップ＋1px `#e2e5ea` 線。
- アイコンセット・画像は不使用。記号はテキスト（`‹ › × › → ✓ +`）で表現する方針（DSのアイコノグラフィに準拠）。
- 外部フォントは Google Fonts の `Inter`（400/500/600/700）と `Noto Sans JP`（400/500/700）のみ。
- 印刷データのサムネイルはプレースホルダー（14px グリッド＋破線ラベル）。実装時は STL からサーバー側で生成した画像に差し替える。

---

## Files

```
design_handoff_3dprint-admin/
  3Dプリント管理.html      … エントリ（ライブラリ読込順のリファレンス）
  admin/admin.css          … 全スタイル（トークンは :root に転記）
  admin/core.js            … ドメインロジック（日時・シード・シフト・CSV・storage）。フレームワーク非依存
  admin/ui.jsx             … Header / DayStrip / CalAdmin / CalDay / KindBadge / Drawer / SettingsDialog / Toast
  admin/daylist.jsx        … DayList / DayGroup / DayRow（依頼・予約の分離表示）
  admin/review.jsx         … ReviewSheet / ReviewActions / StlBlock / Kv / AppLog
  admin/settings.jsx       … SettingsTabs / SettingsPanel / ShiftPlanner / ShiftGrid / MembersPanel / IntegrationDiscord / IntegrationGcal
  admin/App.jsx            … 状態管理とレイアウト（エントリコンポーネント）
  admin/assets/icon-192.png
```

**初期データ**: `core.js` の `seedApps()` が今日を基準に前後3週・38件前後の申請を生成（同一機種で時間が重ならないよう構築）。本番では削除し、`loadApps()` をAPI取得に置き換えること。
