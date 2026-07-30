// functions/lib/simulation/openfoam-review-syntax-reference.ts
// Curated OpenFOAM case syntax summary for Gemini primary review.

import type { Env } from "../types";

/** Official documentation entry points (not fetched at runtime). */
export const OPENFOAM_OFFICIAL_DOCS_URL = "https://www.openfoam.com/documentation/";

export const OPENFOAM_SYNTAX_REFERENCE_FOR_REVIEW = `
## 公式ドキュメント
- OpenFOAM 公式ドキュメント: ${OPENFOAM_OFFICIAL_DOCS_URL}
- ケースはディレクトリ構造（system/, constant/, 0/ 等）で構成
- 辞書ファイルは FoamFile ヘッダ + C++ 風キー・値ペア

## 必須ディレクトリ・ファイル
- system/controlDict: ソルバー名 application, startTime, endTime, deltaT, writeInterval 等
- system/fvSchemes: 離散化スキーム
- system/fvSolution: 線形ソルバー・ SIMPLE/PIMPLE 設定
- constant/: メッシュ情報（polyMesh/）や物性（transportProperties 等）
- 0/（または初期時刻ディレクトリ）: 場の初期条件（U, p 等）

## system/controlDict
- application: 使用ソルバー（simpleFoam, icoFoam, pimpleFoam 等）
- endTime / stopAt: 計算終了条件
- deltaT: 時間刻み
- writeControl / writeInterval: 出力間隔
- functions: 実行時関数オブジェクト

## 並列（MPI）
- decomposeParDict: 領域分割（numberOfSubdomains, method）
- 依頼 MPI プロセス数と numberOfSubdomains の整合
- 並列実行: decomposePar → mpirun -np N solver -parallel → reconstructPar

## よくあるエラー（審査で重視）
- controlDict の application が存在しないソルバー名
- polyMesh/boundary の欠落・破損
- 0/ ディレクトリの場名とソルバー要件の不一致
- fvSchemes / fvSolution のキー欠落
- 単位・次元の不整合
- Allrun がある場合: 実行順序・コマンドの明らかな誤り

## 審査時の注意
- ZIP から抽出された辞書のみを審査対象とする
- 見えないファイルだけを理由に不合格にしない
- 依頼の最大実行時間はウォールクロック上限であり endTime と一致不要
`.trim();

/** Returns syntax reference text (optional env override). */
export function getOpenfoamSyntaxReferenceForReview(
  env?: Pick<Env, "OPENFOAM_REVIEW_SYNTAX_REFERENCE">
): string {
  const override = env?.OPENFOAM_REVIEW_SYNTAX_REFERENCE?.trim();
  if (override) return override;
  return OPENFOAM_SYNTAX_REFERENCE_FOR_REVIEW;
}
