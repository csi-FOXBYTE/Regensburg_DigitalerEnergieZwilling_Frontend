// @ts-check
import { defineConfig } from "astro/config";
import cesium from "vite-plugin-cesium";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import reactI18next from "astro-react-i18next";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), reactI18next({
    defaultLocale: "en",
    locales: ["de", "en"],
    prefixDefaultLocale: true,
    defaultNamespace: "common",
    namespaces: ["common", "landingPage", "progressBar"],
  })],
  vite: {
    plugins: [cesium({}), tailwindcss()],
    optimizeDeps: {
      include: ["cesium", "resium"],
    },
  },
});