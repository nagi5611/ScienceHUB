// functions/lib/simulation/openfoam-content-hash.ts

/** SHA-256 hex digest of a binary buffer (Web Crypto). */
export async function sha256HexFromBuffer(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
