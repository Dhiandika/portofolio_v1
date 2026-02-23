/**
 * ============================================================================
 * ⚠️ WARNING: STABLE BUILD CONFIGURATION - DO NOT MODIFY LIGHTLY ⚠️
 * ============================================================================
 * 
 * This file controls the entire Astro build process, Vite settings, and Vercel deployment.
 * Current setup is perfectly tuned for this specific Neo-Brutalist architecture, 
 * React/Astro coexistence, and Keystatic CMS integration.
 * 
 * Changing settings here (especially Vite dedupe, output mode, or adapters) 
 * can cause deployment failures, UI hydration issues, or CMS blank screens.
 * 
 * ============================================================================
 */

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
  site: 'https://npemburu.my.id',
  vite: {
    plugins: [tailwindcss()],

    resolve: {
      dedupe: ['react', 'react-dom']
    }
  },

  integrations: [react(), sitemap(), mdx()],
  output: 'server',
  adapter: vercel(),
  server: {
    // ⚠️ CRITICAL: Binds to 0.0.0.0 to fix 127.0.0.1 vs localhost issues
    host: true
  }
});