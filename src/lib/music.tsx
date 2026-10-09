import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Music = {
  available: boolean;
  playing: boolean;
  toggle: () => void;
  /** Call synchronously inside a click handler so browsers (Safari) allow audio later. */
  prime: () => void;
  /** Password was right: start playing out loud. */
  commit: () => void;
  /** Password was wrong: undo prime(). */
  cancel: () => void;
};

const Ctx = createContext<Music | null>(null);
export const useMusic = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("MusicProvider is missing");
  return c;
};

export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const primed = useRef(false);
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Put your song at public/music.mp3
    const a = new Audio(`${import.meta.env.BASE_URL}music.mp3`);
    a.loop = true;
    a.volume = 0.6;
    a.addEventListener("error", () => setAvailable(false)); // no file: hide the button
    audio.current = a;
    return () => a.pause();
  }, []);

  const start = useCallback(() => {
    audio.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) start();
    else {
      a.pause();
      setPlaying(false);
    }
  }, [start]);

  const prime = useCallback(() => {
    const a = audio.current;
    if (!a || !a.paused) return; // already playing: nothing to prime
    primed.current = true;
    a.muted = true; // muted playback is always allowed
    a.play().catch(() => {});
  }, []);

  const commit = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    a.muted = false;
    primed.current = false;
    if (a.paused) start();
    else setPlaying(true);
  }, [start]);

  const cancel = useCallback(() => {
    const a = audio.current;
    if (!a || !primed.current) return;
    primed.current = false;
    a.pause();
    a.currentTime = 0;
    a.muted = false;
  }, []);

  const value = useMemo(
    () => ({ available, playing, toggle, prime, commit, cancel }),
    [available, playing, toggle, prime, commit, cancel]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
