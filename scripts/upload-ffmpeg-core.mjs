/**
 * ffmpeg-core.wasm を R2 にアップロード（Pages 25MiB 制限回避）
 *
 * 用法:
 *   node scripts/upload-ffmpeg-core.mjs          # 本番 R2
 *   node scripts/upload-ffmpeg-core.mjs --local  # wrangler pages dev 用ローカル R2
 */
import { uploadWasmToR2 } from "./ffmpeg-r2-shared.mjs";

const local = process.argv.includes("--local");
await uploadWasmToR2(local);
