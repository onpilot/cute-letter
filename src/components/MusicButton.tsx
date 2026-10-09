import { useMusic } from "../lib/music";

export default function MusicButton() {
  const { available, playing, toggle } = useMusic();
  if (!available) return null;
  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed right-4 bottom-4 z-50 grid size-12 place-items-center rounded-full border-2 border-pink-deep bg-cream text-xl shadow-[0_3px_0_#ff9ec7] transition active:translate-y-0.5 active:shadow-none"
    >
      <span className={playing ? "bob" : "opacity-50 grayscale"} aria-hidden="true">
        🎵
      </span>
    </button>
  );
}
