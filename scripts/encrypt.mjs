// Usage: node scripts/encrypt.mjs letter.json "your password"
// Encrypts the letter with AES-256-GCM (key from PBKDF2) into src/letter.enc.json.
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes, pbkdf2Sync, createCipheriv } from "node:crypto";

const [, , file = "letter.json", password] = process.argv;
if (!password) {
  console.error('Usage: node scripts/encrypt.mjs letter.json "your password"');
  process.exit(1);
}

const text = readFileSync(file, "utf8");
JSON.parse(text); // fail early if the JSON is broken

const iterations = 250000;
const salt = randomBytes(16);
const iv = randomBytes(12);
// The password is trimmed and lowercased so "HappyBirthday " still works.
const key = pbkdf2Sync(password.trim().toLowerCase(), salt, iterations, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
// WebCrypto expects ciphertext followed by the 16-byte auth tag.
const data = Buffer.concat([cipher.update(text, "utf8"), cipher.final(), cipher.getAuthTag()]);

writeFileSync(
  "src/letter.enc.json",
  JSON.stringify(
    { iterations, salt: salt.toString("base64"), iv: iv.toString("base64"), data: data.toString("base64") },
    null,
    2
  )
);
console.log("Wrote src/letter.enc.json");
