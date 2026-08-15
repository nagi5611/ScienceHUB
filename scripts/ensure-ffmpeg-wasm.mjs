/**
 * ローカル開発用 — ffmpeg-core.wasm をローカル R2 に配置（public には置かない）
 */
import {
  r2ObjectExists,
  removePublicWasmCopy,
  uploadWasmToR2,
} from "./ffmpeg-r2-shared.mjs";

await removePublicWasmCopy();

if (await r2ObjectExists(true)) {
  console.log("[ensure-ffmpeg-wasm] local R2 に ffmpeg-core.wasm があります");
  process.exit(0);
}

console.log("[ensure-ffmpeg-wasm] local R2 に wasm がないためアップロードします…");
await uploadWasmToR2(true);
