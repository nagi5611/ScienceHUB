import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const passwordCode = readFileSync(join(root, "../functions/lib/password.ts"), "utf8");

// password.ts をそのまま評価する代わりに同等ロジックをインライン検証
const stored =
  "$pbkdf2-sha256$600000$VlFE7laN3Nc-nefs6ASJSA$n6_Qsw93jQwRttqJUA3fRVTfHfmifEYKvMeSNfk_YR0";
const password = "mmh@2048@5431";

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = Buffer.from(padded, "base64");
  return new Uint8Array(binary);
}

const parts = stored.split("$");
const iterations = Number(parts[2]);
const salt = fromBase64Url(parts[3]);
const expected = fromBase64Url(parts[4]);
const keyMaterial = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveBits"]
);
const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
  keyMaterial,
  256
);
const actual = new Uint8Array(bits);
let diff = 0;
for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
console.log(diff === 0 ? "password ok" : "password mismatch");
void passwordCode;
