# Three Uilas website

The website for [threeuilas.com](https://threeuilas.com), a locally owned and operated electric utility vehicle business based in Hilo, Hawaiʻi.

> Our mission is to transform Hawaiʻi agriculture with affordable, useful farm vehicles.

The site uses Astro, Tailwind CSS, and the Cloudflare adapter. Marketing pages are prerendered; the contact API runs on a Cloudflare Worker.

## Local development

Use Node.js 22.12.0 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

Use the local URL printed by Astro, normally `http://localhost:4321`. If that port is occupied, Astro may choose another.

```sh
pnpm check
pnpm build
pnpm preview
```

The check, development, and build scripts create `.astro/` and generate Worker binding types from `wrangler.jsonc`. Run `pnpm cf-typegen` separately when needed. Generated types, build output, dependencies, and `.dev.vars` are ignored by Git.

## Pages and navigation

| Route | Purpose | Source |
| --- | --- | --- |
| `/` | Photo-led introduction and current models | [index.astro](src/pages/index.astro) |
| `/products` | Current-model comparison, buying questions, and expandable sold-out models | [products.astro](src/pages/products.astro) |
| `/products/workhorse-pro` | Workhorse Pro features, gallery, specifications, and inquiries | [workhorse-pro.astro](src/pages/products/workhorse-pro.astro) |
| `/products/sparrow-plus` | Sparrow+ compact utility, foldable seat, gallery, and specifications | [sparrow-plus.astro](src/pages/products/sparrow-plus.astro) |
| `/about` | Our story and mission | [about.astro](src/pages/about.astro) |
| `/contact` | Inquiry form and direct call, text, and email options | [contact.astro](src/pages/contact.astro) |

The header groups All models, Workhorse Pro, and Sparrow+ under Products, alongside Our story and Get in touch. The logo returns home. Each product page has Overview, Features, Gallery, and Specs navigation; its model name links to `#page-top`, above the global header.

## Content and shared components

Shared prices and model specifications live in [products.ts](src/data/products.ts). Feature descriptions, image alt text, FAQs, and page-specific specifications also live in the model data and product-page files; review those together when changing a feature.

| Component or module | Responsibility |
| --- | --- |
| [Layout.astro](src/layouts/Layout.astro) | Shared document metadata, header, footer, and disclosure initialization |
| [ModelPreview.astro](src/components/ModelPreview.astro) | Model presentation on the homepage and catalog |
| [ProductColors.astro](src/components/ProductColors.astro) | Compact, labeled product color swatches from model data |
| [ContactTurnstile.astro](src/components/ContactTurnstile.astro) | Responsive captcha sizing with one verification response field |
| [QuestionList.astro](src/components/QuestionList.astro) | FAQ lists from `{ question, answer }` data |
| [Disclosure.astro](src/components/Disclosure.astro) | Native question and archive disclosures, with a shared plus/X indicator |
| [disclosures.ts](src/scripts/disclosures.ts) | Opening and closing animations, state, keyboard compatibility, and reduced motion |
| [WorkhorseFeatures.astro](src/components/WorkhorseFeatures.astro) | Keyboard-accessible feature tabs with animated images and text |
| [WorkhorsePhoto.astro](src/components/WorkhorsePhoto.astro), [SparrowPhoto.astro](src/components/SparrowPhoto.astro) | Responsive product photos with model-specific alt text |

Use `QuestionList` for FAQs and `Disclosure` for other inline expanders. The Products menu uses the same disclosure controller with its own layout. Programmatic menu changes should call `setDisclosureOpen`, so closing animations and accessibility state remain synchronized.

## Design and writing conventions

The site shares warm neutral backgrounds, dark green sections, red actions, large Asap Condensed headings, and system-font body copy. Design tokens and shared controls live in [global.css](src/styles/global.css). The header contact action uses the same red `.action` style as other primary actions.

Keep copy direct and useful. Emphasize real work, all-steel construction, easy maintenance, and local ownership. Emphasize the Sparrow+ compact footprint and foldable rear seat. Its appearance matches the original Sparrow, so existing photos are used without an original-model disclaimer while new photography is pending.

Use “Delivery available” near product inquiries and on Contact. Explain the additional fee in FAQs; avoid repeating delivery text in homepage and catalog footnotes. Qualify maximum-range figures. Keep current-model payload and towing ratings out of copy unless confirmed; ratings for the sold-out original models do not establish ratings for the current models.

Keep the four product-section links and model-name back-to-top links. Avoid additional arrows that repeat those scrolling actions. Text links use a continuous underline or border. Preserve user-edited copy and update related alt text when feature details change.

Feature tabs, disclosures, indicators, and mobile navigation respect `prefers-reduced-motion`. Native disclosures and image links remain usable without JavaScript; all Workhorse Pro feature panels are visible in that mode.

## Photography

Current product images are committed as 640, 1280, and 1920-pixel-wide WebP assets in `public/workhorse-pro/` and `public/sparrow-plus/`. Hero images load eagerly; other photos load lazily. Alt text comes from [workhorse-pro.ts](src/data/workhorse-pro.ts) and [sparrow-plus.ts](src/data/sparrow-plus.ts).

The temporary `10:22 Workhorse Pro Selected/` camera folder is not a build dependency and was left untracked. The unused `public/three-uilas-logo-compact-print-transparent.png` was also left local. Preserve those files unless the user asks otherwise.

See [the image guide](IMAGE_OPTIMIZATION.md) for asset preparation and [the Workhorse Pro photo notes](docs/workhorse-pro-photography.md) for the selection rationale.

## Contact flow

Product inquiry links use `/contact?vehicle=` with the URL-encoded full model name. The form selects that vehicle and creates a submission UUID, retaining it when a visitor retries.

The original Workhorse and Sparrow options are labeled “discontinued.” Their values remain unchanged so existing inquiry links still select the correct model.

[The contact API](src/pages/api/contact.ts) validates fields, the honeypot, and Cloudflare Turnstile. It then sends the lead to `WEBSITE_LEADS_QUEUE` and attempts a Resend notification. A queue failure returns an error; an email-notification failure is logged after the lead has been queued. Binding names are declared in [wrangler.jsonc](wrangler.jsonc) and [env.d.ts](src/env.d.ts). Keep secret values out of source and documentation.

The form uses `role="alert"` for errors and `role="status"` for success. [ContactTurnstile.astro](src/components/ContactTurnstile.astro) renders a flexible horizontal widget when the form has at least 300px available and a compact widget below that width. It recreates the widget only when resizing crosses that threshold. It still uses `novalidate` and server-side field validation; token reset after submission errors and focus management remain follow-up work.

## Verification and publication

Run `pnpm check` and `pnpm build` after code changes. For UI changes, check relevant pages at phone, tablet, and desktop widths, including 320px and 390px. Verify model inquiry preselection, image loading, gallery controls, keyboard interaction, opening and closing animations, rapid toggling, and reduced-motion behavior.

During the October 23 redesign, browser checks covered 320px, 390px, 768px, and 1440px layouts, both product pages, shared navigation, galleries, native no-JavaScript behavior, and contact error/retry/success states with intercepted requests. Live email delivery, queue processing, production deployment, and cellular performance were not verified. There is no committed browser-test suite or browser-testing dependency; temporary verification scripts are not project tooling.

A static preview of `dist/client/` can verify rendered pages and browser interactions, but cannot exercise the Worker contact API. Use the Worker runtime for integration checks. Sandboxed builds may require permission for local ports and Wrangler logs; a sandbox denial is not evidence of a source-code defect.

During redesign QA, running checks/builds while a development preview remained open produced stale Vite dependency URLs and a gallery-module 404. Restart the development preview after rebuilding before treating that symptom as an application bug, or check the freshly built static pages when testing only frontend behavior.

The existing `pnpm deploy` script builds and runs Wrangler deployment. Pushing source and completing a local build do not, by themselves, verify a live deployment.

## Project documentation

- [AGENTS.md](AGENTS.md): durable project memory and instructions for future coding sessions.
- [Image optimization](IMAGE_OPTIMIZATION.md): current responsive assets and legacy image tooling.
- [Workhorse Pro photography](docs/workhorse-pro-photography.md): photo selection and product-page behavior.
- [Event readiness](docs/event-readiness-review.md): completed improvements and remaining verification gaps.
