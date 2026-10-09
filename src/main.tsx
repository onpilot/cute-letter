import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/700.css";
import "@fontsource/gaegu/400.css";
import "@fontsource/gaegu/700.css";
import "./index.css";
import App from "./App";
import { MusicProvider } from "./lib/music";

createRoot(document.getElementById("root")!).render(
  <MotionConfig reducedMotion="user">
    <MusicProvider>
      <App />
    </MusicProvider>
  </MotionConfig>
);
