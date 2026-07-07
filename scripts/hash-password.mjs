const ITERATIONS = 10000;
const password = process.argv[2] ?? "mmh@2048@5431";
const salt = crypto.getRandomValues(new Uint8Array(16));
const enc = new TextEncoder();
const key = await crypto.subtle.importKey(
  "raw",
  enc.encode(password),
  "PBKDF2",
  false,
  ["deriveBits"]
);
const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  key,
  256
);
const b64 = (u8) => Buffer.from(u8).toString("base64url");
const hash = `$pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
console.log(hash);
