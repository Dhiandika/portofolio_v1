// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://arham-exe.vercel.app',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // ⚠️ CRITICAL KEYSTATIC CONFIGURATION - DO NOT MODIFY ⚠️
      // Keystatic MUST be included in optimization to prevent "syntax error" and "white screen" issues.
      // Removing these from `include` will break the admin UI.
      include: [
        '@keystatic/core',
        '@keystatic/astro',
        'lodash/debounce',
        'direction',
        'yjs',
        'slate',
        'slate-react',
        'superstruct',
        'is-hotkey'
      ]
    },
    resolve: {
      dedupe: ['react', 'react-dom']
    }
  },

  integrations: [react(), sitemap(), mdx()],
  output: 'static',
  adapter: vercel(),
  server: {
    // ⚠️ CRITICAL: Binds to 0.0.0.0 to fix 127.0.0.1 vs localhost issues
    host: true
  }
});