import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import * as Label from "@radix-ui/react-label";
import { useMusic } from "../lib/music";

type Props = { open: boolean; onSubmit: (password: string) => Promise<boolean> };

const hint = import.meta.env.VITE_PASSWORD_HINT as string | undefined;

export default function Envelope({ open, onSubmit }: Props) {
  const music = useMusic();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(false);
    music.prime(); // must run before any await so the click still counts as a gesture
    const ok = await onSubmit(password);
    if (ok) {
      music.commit();
    } else {
      music.cancel();
      setError(true);
      setBusy(false);
    }
  }

  return (
    <motion.main
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-5 py-8 sm:gap-12 sm:px-6 sm:py-12"
    >
      <h1 className="font-hand text-center text-4xl font-bold text-cocoa sm:text-6xl">a letter for you 💌</h1>

      {/* Envelope */}
      <div
        className="relative aspect-[3/2] w-[min(86vw,26rem)] drop-shadow-[0_6px_0_rgba(224,85,143,0.35)]"
        style={{ perspective: 1200 }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-2xl border-2 border-pink-deep bg-[#ffb3d1]" />

        <motion.div
          className="absolute inset-x-[6%] top-[8%] bottom-[4%] z-10 rounded-md border-2 border-pink bg-cream"
          animate={{ y: open ? "-58%" : "0%" }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        <div
          className="absolute inset-0 z-20 rounded-2xl bg-[#ffd0e3]"
          style={{ clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)" }}
        />

        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] bg-[#ffc2db]"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformOrigin: "top" }}
          animate={{ rotateX: open ? 180 : 0, zIndex: open ? 5 : 30 }}
          transition={{
            rotateX: { duration: 0.7, delay: 0.1, ease: "easeInOut" },
            zIndex: { duration: 0, delay: open ? 0.45 : 0 },
          }}
        />

        <motion.div
          className="absolute left-1/2 z-40 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-blue-deep shadow-[0_3px_0_#4f8fd6]"
          style={{ top: "58%" }}
          animate={{ scale: open ? 0.4 : 1, opacity: open ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 24 24" className="size-6 fill-white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </div>

      {/* Password */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xs flex-col items-center gap-3"
        animate={{ x: error ? [0, -8, 8, -5, 5, 0] : 0, opacity: open ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <Label.Root htmlFor="password" className="font-hand text-2xl">
          type the secret password
        </Label.Root>
        <div className="relative w-full">
        <input
          id="password"
          type={show ? "text" : "password"}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          value={password}
          disabled={busy}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          aria-invalid={error}
          aria-describedby="password-error"
          className="w-full rounded-full border-2 border-pink-deep bg-white/80 px-12 py-2.5 text-center text-lg tracking-widest text-cocoa shadow-[0_3px_0_#ff9ec7] outline-none placeholder:text-cocoa/30 focus:border-blue-deep focus:shadow-[0_3px_0_#7db8f5]"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          onMouseDown={(e) => e.preventDefault()} // keep focus in the input
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute top-1/2 right-1.5 grid size-10 -translate-y-1/2 place-items-center rounded-full text-cocoa/70 transition hover:bg-pink/70"
        >
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
            {show && <path d="M3 3l18 18" />}
          </svg>
        </button>
        </div>
        <p id="password-error" role="alert" className="min-h-6 font-hand text-xl text-berry">
          {error ? "oops, that's not it. try again 🥺" : hint ? `hint: ${hint}` : ""}
        </p>
        <button
          type="submit"
          disabled={busy || !password}
          className="rounded-full bg-berry px-8 py-2.5 text-lg font-bold text-white shadow-[0_4px_0_#b23a70] transition hover:brightness-105 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {busy ? "opening…" : "open letter 💌"}
        </button>
      </motion.form>
    </motion.main>
  );
}
