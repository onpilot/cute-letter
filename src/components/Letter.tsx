import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import type { LetterData } from "../lib/crypto";

type Props = { letter: LetterData; onClose: () => void };

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Types out a page. The not-yet-typed part stays in the layout (invisible) so nothing jumps. */
function PageText({ paragraphs, animate, onDone }: { paragraphs: string[]; animate: boolean; onDone: () => void }) {
  const total = paragraphs.reduce((n, p) => n + p.length + 1, 0);
  const [n, setN] = useState(animate ? 0 : total);

  useEffect(() => {
    if (n >= total) {
      onDone();
      return;
    }
    const id = setTimeout(() => setN(n + 1), 22);
    return () => clearTimeout(id);
  }, [n, total, onDone]);

  let offset = 0;
  return (
    <div className="flex flex-col gap-10" onClick={() => setN(total)}>
      {paragraphs.map((p, i) => {
        const shown = Math.max(0, Math.min(p.length, n - offset));
        offset += p.length + 1;
        return (
          <p key={i} className="font-hand text-2xl leading-10 sm:text-[1.7rem]">
            <span>{p.slice(0, shown)}</span>
            <span className="opacity-0">{p.slice(shown)}</span>
          </p>
        );
      })}
    </div>
  );
}

export default function Letter({ letter, onClose }: Props) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const total = letter.pages.length;
  const isFirst = page === 0;
  const isLast = page === total - 1;
  const typed = seen.has(page);

  const markSeen = useCallback(() => setSeen((s) => (s.has(page) ? s : new Set(s).add(page))), [page]);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return;
      setDir(next > page ? 1 : -1);
      setPage(next);
      window.scrollTo({ top: 0 });
    },
    [page, total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(page + 1);
      if (e.key === "ArrowLeft") go(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, page]);

  // One confetti burst when the letter opens
  useEffect(() => {
    const t = setTimeout(
      () =>
        confetti({
          particleCount: window.innerWidth < 640 ? 70 : 110,
          spread: 85,
          origin: { y: 0.35 },
          colors: ["#ffd6e8", "#ff9ec7", "#cfe8ff", "#7db8f5", "#e8dcff", "#fff3b0"],
          disableForReducedMotion: true,
        }),
      500
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-7 px-4 pt-10 pb-28 sm:py-12">
      <motion.article
        initial={{ y: 90, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-3xl border-2 border-pink-deep bg-cream p-3 shadow-[0_8px_0_#ff9ec7]"
      >
        {/* washi tape */}
        <div
          aria-hidden="true"
          className="absolute -top-3.5 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-3 rounded-sm bg-blue-deep/50"
        />
        <div className="lined min-h-[60dvh] rounded-2xl px-6 py-10 sm:px-10">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 28 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 * dir }}
              transition={{ duration: 0.35 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(page + 1);
                else if (info.offset.x > 60) go(page - 1);
              }}
              className="flex flex-col gap-10"
            >
              {isFirst && <p className="font-hand text-4xl leading-10 font-bold text-berry sm:text-5xl">{letter.greeting}</p>}
              <PageText paragraphs={letter.pages[page]} animate={!typed && !prefersReduced()} onDone={markSeen} />
              {isLast && typed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                  <p className="font-hand text-2xl leading-10 sm:text-[1.7rem]">{letter.closing}</p>
                  <p className="font-hand text-4xl leading-[2.5rem] font-bold text-berry sm:text-5xl">{letter.signature} 💌</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.article>

      <motion.nav
        aria-label="Letter pages"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="grid w-full grid-cols-2 gap-3 text-lg font-bold sm:flex sm:items-center sm:justify-between"
      >
        <button
          onClick={() => go(page - 1)}
          disabled={isFirst}
          className="rounded-full border-2 border-pink-deep bg-cream px-5 py-2.5 shadow-[0_3px_0_#ff9ec7] transition active:translate-y-0.5 active:shadow-none disabled:invisible"
        >
          ‹ back
        </button>

        <div className="order-first col-span-2 flex flex-wrap items-center justify-center sm:order-none sm:col-span-1">
          {letter.pages.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Page ${i + 1} of ${total}`}
              aria-current={i === page}
              className="grid size-9 place-items-center"
            >
              <span
                className={`block size-3 rounded-full border-2 border-pink-deep transition ${i === page ? "scale-125 bg-pink-deep" : "bg-cream"}`}
              />
            </button>
          ))}
        </div>

        {isLast ? (
          <button
            onClick={onClose}
            className="rounded-full bg-blue-deep px-5 py-2.5 text-white shadow-[0_3px_0_#4f8fd6] transition active:translate-y-0.5 active:shadow-none"
          >
            close letter
          </button>
        ) : (
          <button
            onClick={() => go(page + 1)}
            className="rounded-full bg-berry px-5 py-2.5 text-white shadow-[0_3px_0_#b23a70] transition active:translate-y-0.5 active:shadow-none"
          >
            next page ›
          </button>
        )}
      </motion.nav>

      <p className="font-hand text-xl">
        {typed ? "made with love, just for you 🩶" : "tap the letter to skip the typing"}
      </p>
    </main>
  );
}
