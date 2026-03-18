// @ts-check
import { defineConfig } from "astro/config";
import cesium from "vite-plugin-cesium";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [cesium({}), tailwindcss()],
    optimizeDeps: {
      include: ["cesium", "resium"],
    },
  },
});
