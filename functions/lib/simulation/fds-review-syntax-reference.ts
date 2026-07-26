// functions/lib/simulation/fds-review-syntax-reference.ts
// Curated FDS input syntax summary for Gemini primary review.
// Authoritative source: NIST FDS User's Guide (firemodels/fds). Update when platform FDS version changes.

import type { Env } from "../types";

/** Official documentation entry points (not fetched at runtime). */
export const FDS_OFFICIAL_MANUALS_URL = "https://pages.nist.gov/fds-smv/manuals.html";

/**
 * Condensed syntax reference embedded in the review prompt (~token budget).
 * Derived from the public-domain FDS User's Guide namelist descriptions.
 */
export const FDS_SYNTAX_REFERENCE_FOR_REVIEW = `
## 公式ドキュメント
- FDS-SMV マニュアル一覧: ${FDS_OFFICIAL_MANUALS_URL}
- 入力ファイルは「namelist」形式（Fortran 風）。各レコードは & で始まり / で終わる。
- 単位は SI（m, s, kg, K, Pa 等）。キーワードは大文字が慣例（FDS は多くのキーを大小無視）。

## ファイル全体
- コメント: 行頭または行内の ! 以降
- 複数の &GROUP ... / レコードを順に記述
- 文字列は単一引用符 '...' が一般的
- 典型的な最小構成: &HEAD / &MESH（1つ以上）/ &TIME / &TAIL /
- &TAIL / は入力終端の目印（推奨）

## &HEAD
- CHID: 出力ファイル名の接頭辞（必須に近い）
- TITLE: 説明タイトル
例: &HEAD CHID='case1', TITLE='description' /

## &MESH（計算領域）
- IJK: セル数 (nx, ny, nz) — 正の整数
- XB: 物理範囲 (xmin,xmax, ymin,ymax, zmin,zmax) — xmax>xmin 等
- 複数メッシュ: 複数の &MESH 行。ID='name' で識別
- MPI: メッシュごとに MPI_PROCESS=n を割り当て可能（合計が実行 MPI 数と整合すること）
例: &MESH IJK=10,10,10, XB=0.0,1.0,0.0,1.0,0.0,1.0 /

## &TIME
- T_END: シミュレーション終了時刻 [s]（物理シミュレーションの終了。依頼フォームの「最大実行時間（時間）」とは無関係）
- 依頼の最大実行時間はクラウド上のウォールクロック上限であり、T_END をそれに合わせる必要はない（T_END=1秒のスモークテストも正当）
- DT: 初期タイムステップ [s]（省略時は自動）
- 非現実的に小さい DT など、起動直後に破綻する設定のみ審査で重視する

## 固体・境界
- &OBST: 障害物 XB= または XYZ=, SURF_ID=
- &SURF: 境界条件 ID, 色, 反射率, MATL_ID=（燃焼面など）
- &MATL: 材料 ID, 熱伝導・比熱・密度・燃焼パラメータ等
- &VENT: 開口・ファン・境界 TYPE=（例 OPEN, WALL, PERIODIC）, SURF_ID=, XB= または IOR=

## 火源・燃焼・化学
- &REAC: 化学反応（燃料・酸化剤・熱放出等）
- &SPEC: 種 ID, 物性（FORMULA 等）
- 表面燃焼は SURF + MATL の組み合わせが一般的（入力の整合が必要）
- 旧式・非推奨キーワードや REAC/SPEC の ID 参照ミスは実行時エラーになりやすい

## デバイス・出力
- &DEVC: 計測点（TEMPERATURE, VELOCITY 等）, XYZ= または XB=
- &SLCF / &BNDF / &ISOF: スライス・境界・等値面出力
- &DUMP: 出力間隔 DT_DEVC, DT_SLCF 等

## &MISC / 並列
- MPI_PROCESS: 全体またはメッシュ割当（バージョン・入力構成による）
- OPENMP_THREADS 等（環境による）
- 依頼 MPI プロセス数と矛盾するメッシュ分割は実行失敗や非効率の原因

## よくある構文・設定エラー（審査で重視）
- &GROUP の閉じ / の欠落、引用符の未閉じ
- IJK または XB の要素数不足・順序誤り
- 存在しない SURF_ID / MATL_ID / SPEC_ID / REAC_ID の参照
- 重複 CHID、空のメッシュ、ゼロ体積セル
- VENT の TYPE と SURF の組み合わせ不整合
- 燃焼系なのに REAC/SPEC/MATL が欠落
- 単位の取り違え（例: mm を m として記述）

## 審査時の注意
- 上記は公式 User's Guide の要約であり、全バージョンの差分はマニュアルが正とする
- 抜粋ファイルのみ渡された場合は、見えている範囲で構文・参照整合を優先して判断する
`.trim();

/** Returns syntax reference text (optional env override for longer excerpts). */
export function getFdsSyntaxReferenceForReview(env?: Pick<Env, "FDS_REVIEW_SYNTAX_REFERENCE">): string {
  const override = env?.FDS_REVIEW_SYNTAX_REFERENCE?.trim();
  if (override) return override;
  return FDS_SYNTAX_REFERENCE_FOR_REVIEW;
}
