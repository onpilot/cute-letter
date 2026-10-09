import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Envelope from "./components/Envelope";
import Letter from "./components/Letter";
import MusicButton from "./components/MusicButton";
import Sparkles from "./components/Sparkles";
import { unlock, type LetterData } from "./lib/crypto";

type Phase = "locked" | "opening" | "reading";

export default function App() {
  const [phase, setPhase] = useState<Phase>("locked");
  const [letter, setLetter] = useState<LetterData | null>(null);

  async function handleUnlock(password: string) {
    const data = await unlock(password);
    if (!data) return false;
    setLetter(data);
    setPhase("opening");
    setTimeout(() => setPhase("reading"), 2300); // let the envelope finish opening
    return true;
  }

  return (
    <>
      <Sparkles />
      <AnimatePresence mode="wait">
        {phase !== "reading" || !letter ? (
          <Envelope key="envelope" open={phase === "opening"} onSubmit={handleUnlock} />
        ) : (
          <Letter
            key="letter"
            letter={letter}
            onClose={() => {
              setLetter(null);
              setPhase("locked");
            }}
          />
        )}
      </AnimatePresence>
      <MusicButton />
    </>
  );
}
