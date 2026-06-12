// @ts-check
import { defineConfig } from 'astro/config';
import cesium from 'vite-plugin-cesium';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import reactI18next from 'astro-react-i18next';

import pkg from './package.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    reactI18next({
      defaultLocale: 'en',
      locales: ['de', 'en'],
      prefixDefaultLocale: true,
      defaultNamespace: 'common',
      namespaces: [
        'common',
        'landingPage',
        'progressBar',
        'energyCalculation',
        'map',
      ],
    }),
  ],
  vite: {
    plugins: [cesium({}), tailwindcss()],
    define: {
      __FRONTEND_VERSION__: JSON.stringify(pkg.version),
      __CORE_VERSION__: JSON.stringify(
        pkg.dependencies[
          '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore'
        ],
      ),
    },
    optimizeDeps: {
      include: ['cesium', 'resium'],
    },
    server: {
      proxy: {
        '/api': 'http://apisix:9080',
      },
    },
  },
});
