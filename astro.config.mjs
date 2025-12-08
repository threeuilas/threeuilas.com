// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://threeuilas.com', // Update this to your GitHub Pages URL if different
  vite: {
    plugins: [tailwindcss()]
  }
});