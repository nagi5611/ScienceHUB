# ScienceHUB

学校や研究機関での**科学研究**（シミュレーション、ファイル共有など）を促進するために作ったプロジェクトです。

## 技術構成

主に **Cloudflare** のサービスで構成し、**維持費がかかりにくい**設計にしています。

| サービス | 用途 |
|----------|------|
| [Pages](https://pages.cloudflare.com/) | フロントエンドのホスティング |
| [Workers](https://workers.cloudflare.com/) | API・サーバーレス処理 |
| [R2](https://www.cloudflare.com/developer-platform/r2/) | ファイルストレージ |
| [D1](https://developers.cloudflare.com/d1/) | データベース |

## ライセンス

[ScienceHUB License](./LICENSE.md)（独自ライセンス）で公開しています。

- **非商用の研究目的**なら、個人・学校・研究機関・企業を問わず利用・改変・解析 OK
- **商用利用・サービス化**は事前の書面許諾が必要

お問い合わせ: [developer@mmh-virtual.jp](mailto:developer@mmh-virtual.jp)（副: [nagi@mmh-virtual.jp](mailto:nagi@mmh-virtual.jp) / [harumacci94@gmail.com](mailto:harumacci94@gmail.com)）

詳細は [LICENSE.md](./LICENSE.md) を参照してください。
