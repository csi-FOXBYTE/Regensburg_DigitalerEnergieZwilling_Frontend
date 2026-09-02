// @ts-check
import { defineConfig } from 'astro/config';
import cesium from 'vite-plugin-cesium';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import pkg from './package.json' with { type: 'json' };

/** @type {import('astro').AstroIntegration} */
const initializeClientI18next = {
  name: 'initialize-client-i18next',
  hooks: {
    'astro:config:setup': ({ injectScript }) => {
      injectScript('before-hydration', `import '@/i18n/client';`);
    },
  },
};

const dynamicDeletionRoutes = {
  name: 'dynamic-deletion-routes',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (!request.url) return next();

      const url = new URL(request.url, 'http://localhost');
      const neutralMatch = /^\/delete\/([^/]+)$/.exec(url.pathname);
      if (neutralMatch) {
        const locale = /^de/i.test(request.headers['accept-language'] ?? '')
          ? 'de'
          : 'en';
        response.statusCode = 302;
        response.setHeader(
          'Location',
          `/${locale}/delete/${neutralMatch[1]}${url.search}`,
        );
        response.end();
        return;
      }

      const localizedMatch = /^\/(de|en)\/delete\/[^/]+$/.exec(url.pathname);
      if (localizedMatch) {
        request.url = `/${localizedMatch[1]}/delete${url.search}`;
      }
      next();
    });
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [react(), initializeClientI18next],
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
      fallbackType: 'redirect',
    },
  },
  vite: {
    plugins: [dynamicDeletionRoutes, cesium({}), tailwindcss()],
    define: {
      // react-draggable >=4.6.0 references process.env.DRAGGABLE_DEBUG at
      // runtime; without this define `process` is undefined in the browser
      // and dragging throws "process is not defined".
      'process.env.DRAGGABLE_DEBUG': 'false',
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
