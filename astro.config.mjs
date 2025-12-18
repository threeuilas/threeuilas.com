// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Update this to your GitHub Pages URL if different
  site: 'https://threeuilas.com',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});