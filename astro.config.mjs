// @ts-check
import { defineConfig } from "astro/config";
import cesium from "vite-plugin-cesium";

import react from "@astrojs/react";
import i18nTypeGen from "./plugins/i18nTypeGen";
import i18nConfig from "./src/shared/locales";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  i18n: {
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLanguage,
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [cesium({}), i18nTypeGen()],
    optimizeDeps: {
      include: ["cesium", "resium"],
    },
  },
});
