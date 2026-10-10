# Three Uilas Website

Website for [threeuilas.com](https://threeuilas.com) built with Astro and Tailwind CSS. Quality electric tricycles for all!

## Getting Started

Use Node.js 22.12.0 or newer. Development and production builds automatically generate Cloudflare Worker types from `wrangler.jsonc` and local bindings. Run `pnpm cf-typegen` to regenerate them separately.

Run `pnpm check` to check Astro and TypeScript files before building.

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```
   The site will be available at `localhost:4321`

3. Build for production:
   ```bash
   pnpm build
   ```

4. Preview production build:
   ```bash
   pnpm preview
   ```
