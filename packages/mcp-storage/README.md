# ScienceHUB Cloud Storage MCP

Cursor などの AI エージェントが ScienceHUB クラウドストレージを操作するための MCP サーバーです。

## 前提

1. ScienceHUB にログインし、クラウドストレージアプリで **AI エージェント連携** からトークンを発行
2. 発行された `shat_...` トークンを環境変数に設定

## 環境変数

| 変数 | 説明 |
|------|------|
| `SCIENCEHUB_API_URL` | ScienceHUB のベース URL（例: `https://example.pages.dev` または `http://localhost:8788`） |
| `SCIENCEHUB_TOKEN` | Personal Access Token（`shat_` で始まる） |

## Cursor 設定例

`~/.cursor/mcp.json` またはプロジェクトの `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sciencehub-storage": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-storage/src/index.ts"],
      "env": {
        "SCIENCEHUB_API_URL": "http://localhost:8788",
        "SCIENCEHUB_TOKEN": "shat_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

リポジトリ外から使う場合は、先に `packages/mcp-storage` で `npm install` し、`node dist/index.js` を指定してください。

## 提供ツール

| ツール | 説明 |
|--------|------|
| `storage_list_roots` | ルート一覧 |
| `storage_list_directory` | ディレクトリ一覧 |
| `storage_search` | ファイル検索 |
| `storage_download` | ダウンロード（小さいテキストはインライン） |
| `storage_upload` | アップロード |
| `storage_mkdir` | フォルダ作成 |
| `storage_get_quota` | クォータ確認 |

## 開発

```bash
cd packages/mcp-storage
npm install
npm run build
```

### Cursor 連携（全プロジェクト共通）

1. 本番: https://s.mmh-virtual.jp/apps/cloud-storage/ → **その他** → **AI エージェント連携** でトークン発行
2. ユーザー全体設定 `~/.cursor/mcp.json` に `sciencehub-storage` を追加（このリポジトリでは `.cursor/mcp.json.example` を参照）
3. `packages/mcp-storage` を `npm run build` してから Cursor を再起動

`SCIENCEHUB_API_URL` はサイトのベース URL（`/apps/cloud-storage/` ではない）。

## ChatGPT 連携（Secure MCP Tunnel）

Cursor の stdio MCP は ChatGPT ではそのまま使えません。**OpenAI Secure MCP Tunnel** でローカル MCP を HTTPS 経由で ChatGPT に接続します。

出典: [Secure MCP Tunnel（OpenAI）](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)

### こちらで用意済み

- `tunnel/bin/tunnel-client.exe`（v0.0.14・再取得は README 内 URL）
- `tunnel/run-mcp-storage.ps1` — MCP 起動ラッパー
- `tunnel/setup-tunnel.ps1` — プロファイル初期化
- `tunnel/start-tunnel.ps1` — トンネル常駐起動

### あなたが行う作業（OpenAI ログイン必須・自動化不可）

1. **Developer Mode** を ON  
   ChatGPT → Settings → Security and login  
   出典: [Developer mode（OpenAI）](https://developers.openai.com/api/docs/guides/developer-mode)

2. **トンネルを作成**  
   [Platform Tunnels](https://platform.openai.com/settings/organization/tunnels) → Create tunnel  
   ChatGPT ワークスペースを関連付ける

3. **Runtime API キー**（Tunnels **Read** + **Use**）  
   [API keys](https://platform.openai.com/settings/organization/api-keys) → Restricted

4. **`.tunnel.env` を編集**（`tunnel/.tunnel.env.example` をコピー済み）

   ```
   CONTROL_PLANE_API_KEY=sk-...
   CONTROL_PLANE_TUNNEL_ID=tunnel_...
   ```

5. **セットアップと起動**

   ```powershell
   cd packages/mcp-storage
   npm run build
   cd tunnel
   .\setup-tunnel.ps1
   .\start-tunnel.ps1
   ```

6. **ChatGPT で接続**  
   [Connectors](https://chatgpt.com/#settings/Connectors) → **Connection: Tunnel** → トンネルを選択  
   `start-tunnel.ps1` は起動したままにする

### トンネル作成を CLI で行う場合（任意）

Admin キー（Tunnels **Read** + **Manage**）がある場合:

```powershell
$env:OPENAI_ADMIN_KEY = "sk-admin-..."
.\bin\tunnel-client.exe admin tunnels create --name "ScienceHUB Storage" --organization-id <ORG_ID> --workspace-id <WORKSPACE_ID>
```

`tunnel_id` を `.tunnel.env` に記入する。

