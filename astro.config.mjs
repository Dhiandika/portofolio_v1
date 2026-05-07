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

  integrations: [react(), sitemap({
    // Add pages that aren't auto-discovered in server mode
    customPages: [
      // Main pages
      'https://npemburu.my.id/en/',
      'https://npemburu.my.id/id/',
      // About
      'https://npemburu.my.id/en/about',
      'https://npemburu.my.id/id/about',
      // Projects listing
      'https://npemburu.my.id/en/projects',
      'https://npemburu.my.id/id/projects',
      // Achievements
      'https://npemburu.my.id/en/achievements',
      'https://npemburu.my.id/id/achievements',
      // Blog
      'https://npemburu.my.id/en/blog',
      'https://npemburu.my.id/id/blog',
    ],
    // Filter out test/internal pages
    filter: (page) => !page.includes('/test-') && !page.includes('/keystatic') && !page.includes('/api/'),
    // Add lastmod, priority, changefreq
    serialize: (item) => {
      const url = item.url;
      // Homepage gets highest priority
      if (url === 'https://npemburu.my.id/' || url.endsWith('/en/') || url.endsWith('/id/')) {
        return { ...item, lastmod: new Date().toISOString(), priority: 1.0, changefreq: 'weekly' };
      }
      // Main section pages
      if (url.includes('/about') || url.includes('/projects') && !url.includes('/projects/') || url.includes('/achievements') || url.includes('/blog') && !url.includes('/blog/')) {
        return { ...item, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' };
      }
      // Individual project/blog pages
      return { ...item, lastmod: new Date().toISOString(), priority: 0.6, changefreq: 'monthly' };
    },
    // Multilingual support
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        id: 'id',
      },
    },
  }), mdx()],
  output: 'server',
  adapter: vercel(),
  server: {
    // ⚠️ CRITICAL: Binds to 0.0.0.0 to fix 127.0.0.1 vs localhost issues
    host: true
  }
});