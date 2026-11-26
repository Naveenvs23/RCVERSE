import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
// vite serves the react app; the react plugin handles jsx and the babel plugin
// enables the react compiler preset during development and production builds.
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
