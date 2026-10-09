import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" lets the built site work on GitHub Pages sub-paths and any static host
export default defineConfig({ base: "./", plugins: [react(), tailwindcss()] });
