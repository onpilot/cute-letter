import blob from "../letter.enc.json";

export type LetterData = {
  greeting: string;
  pages: string[][]; // each page is a list of paragraphs
  closing: string;
  signature: string;
};

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** Returns the decrypted letter, or null when the password is wrong. */
export async function unlock(password: string): Promise<LetterData | null> {
  try {
    const raw = new TextEncoder().encode(password.trim().toLowerCase());
    const base = await crypto.subtle.importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: fromB64(blob.salt), iterations: blob.iterations, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(blob.iv) }, key, fromB64(blob.data));
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    return null; // AES-GCM rejects a wrong key
  }
}
