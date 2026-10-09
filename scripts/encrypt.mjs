// Usage: node scripts/encrypt.mjs letter.json "your password" [photo.jpg]
// Encrypts the letter with AES-256-GCM (key from PBKDF2) into src/letter.enc.json.
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes, pbkdf2Sync, createCipheriv } from "node:crypto";
import { extname } from "node:path";

const [, , file = "letter.json", password, photoPath] = process.argv;
if (!password) {
  console.error('Usage: node scripts/encrypt.mjs letter.json "your password" [photo.jpg]');
  process.exit(1);
}

const letter = JSON.parse(readFileSync(file, "utf8")); // fails early if the JSON is broken

// Optional small photo for the first page. It is stored inside the encrypted data,
// so it is protected by the password too (unlike a file in /public).
if (photoPath) {
  const mimes = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
  const mime = mimes[extname(photoPath).toLowerCase()];
  if (!mime) {
    console.error("Photo must be .jpg, .jpeg, .png, .webp or .svg");
    process.exit(1);
  }
  const buf = readFileSync(photoPath);
  if (buf.length > 150 * 1024) console.warn(`Warning: photo is ${Math.round(buf.length / 1024)} KB. Resize it to ~300px wide (under 150 KB) to keep the site fast.`);
  letter.photo = `data:${mime};base64,${buf.toString("base64")}`;
}
const text = JSON.stringify(letter);

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
