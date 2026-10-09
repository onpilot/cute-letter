# Cute letter

A static Vite + React site: a sealed envelope, a password, then a cute multi-page letter.

<img width="1891" height="1080" alt="Preview" src="https://github.com/user-attachments/assets/647c4644-0787-4791-905d-4ff00aca9a30" />

## Run it

```bash
npm install
cp letter.example.json letter.json   # then write your own letter
npm run encrypt -- letter.json "your password" photo.jpg   # photo is optional
npm run dev
```

The included example letter uses the password `happybirthday`.

## Edit the letter

`letter.json` has `greeting`, `pages` (each page is a list of paragraphs), `closing`, `signature`.
Add or remove pages freely. Re-run the encrypt command after every change.

## Why encrypt?

A static site has no server, so a plain "if password === ..." check would leave the whole letter
readable in the page source. Here the letter is encrypted (AES-256-GCM, key from PBKDF2) and the
password is the decryption key, so only the right password reveals the text.
Use a password that isn't easy to guess, since anyone can try offline.
Only `src/letter.enc.json` is published; `letter.json` is git-ignored.

## Small photo on the first page

Pass a photo as the 3rd argument to `npm run encrypt` (jpg, png, webp or svg). It appears as a tiny polaroid at the
top right of page 1. Resize it to about 300px wide (under 150 KB) first. The photo is encrypted together with the
letter, so it's protected by the password too. Leave the argument out for no photo. Re-run the command after changes.

## Background music

Put your song at `public/music.mp3` (mp3). It starts when the right password is entered and loops.
A round 🎵 button (bottom-right) pauses and resumes it. If the file is missing, the button hides itself.
Browsers block autoplay, so music can only start after a click. That's why it starts on "open letter".
Use music you have the rights to, and keep the file small (under ~5 MB) so the site loads fast.

## Mobile

Designed phone-first: swipe the letter left/right to turn pages (or use the buttons), large tap targets,
safe-area padding for notches, and 16px+ inputs so iOS doesn't zoom. Test with your browser's device mode.

## Colors and fonts

Colors are the `--color-*` values at the top of `src/index.css`. Fonts are Gaegu (handwriting) and Quicksand (UI).

## Optional password hint

Create `.env` with `VITE_PASSWORD_HINT="the place we first met"`.

## Deploy

`npm run build`, then upload `dist/` to Netlify, Vercel, Cloudflare Pages or GitHub Pages.
