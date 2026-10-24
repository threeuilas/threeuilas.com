# Three Uilas project memory

Read [README.md](README.md) for routes, source locations, local commands, and verification scope. This file records project decisions for future sessions; current user instructions and edits take precedence.

## Business and content

- Three Uilas is locally owned and operated in **Hilo, Hawaiʻi**. Do not restore the former Orchidland Estates location.
- The website and vehicle flyers use **(808) 300-0605**. Call and text links use `+18083000605`; display signs intentionally omit the phone number.
- Preserve the mission exactly: **“Our mission is to transform Hawaiʻi agriculture with affordable, useful farm vehicles.”**
- Our story intentionally has no “What matters to us” section; that content duplicated the rest of the site.
- Keep prose short, direct, and practical. Emphasize real work, all-steel construction, easy maintenance, and local ownership.
- Preserve user-edited product copy. When features change, review image alt text and related page specifications alongside it.
- Emphasize the **Sparrow+ compact footprint** and foldable rear seat rather than making a practical steel bed its main feature.
- Sparrow+ looks the same as the original Sparrow. Existing photos can be used without an “original Sparrow shown” disclaimer. New Sparrow+ photography is pending.
- Workhorse Pro copy includes high-brightness LED headlights with high/low beams, low-range gearing, and a two-inch hitch ball. Alt text should identify those parts accurately without inventing what a photo demonstrates.
- Use `src/data/products.ts` for shared model prices and specifications. The user confirmed **1,500 lb cargo capacity for the Workhorse Pro** for its trade-show flyer. Do not infer other current-model payload or towing ratings from sold-out original-model figures.
- Use **“Delivery available”** near product inquiries and on Contact. Explain the additional fee in FAQs, not repeated homepage or catalog footnotes.

## Design and navigation

- The standard Workhorse Pro wordmark uses dark “Workhorse” and red “Pro.”, as in the product-page navigation header; use this treatment on the flyer.
- Workhorse Pro colors are Tractor Red, Blaze Orange, Forest Green, Ocean Blue, and Coastal Aqua. Their names and hex values live in `src/data/products.ts`; `ProductColors.astro` displays compact swatches in the product-page overview, matching the flyer palette.
- Keep the common visual language across all pages: warm paper backgrounds, dark green sections, red primary actions, Asap Condensed headings, and system-font body copy.
- Use shared tokens and controls in `src/styles/global.css`. The header Get in touch button uses the same red `.action` style as primary actions elsewhere.
- Header organization: Products → All models / Workhorse Pro / Sparrow+; Our story; Get in touch. The logo returns home.
- Both available models have dedicated product pages. Current model cards link to those pages; original models remain in the catalog’s expandable sold-out reference section.
- Keep Overview / Features / Gallery / Specs links on product pages. The model name in each sticky bar links to `#page-top` at the very top of the document.
- Avoid redundant section-jump arrows and inflated slogans. Use continuous underlines or borders for text links.

## Shared behavior

- Use `QuestionList.astro` for FAQs and `Disclosure.astro` for inline expanders. Keep question/answer data on the relevant page.
- `src/scripts/disclosures.ts` owns shared opening/closing behavior and state. Programmatic Products-menu changes should call `setDisclosureOpen`, rather than bypassing its animation with direct `open` assignments.
- Expanders animate in both directions, plus/X indicators rotate, and the Products chevron and mobile navigation have matching motion. Preserve rapid-toggle handling, keyboard operation, native no-JavaScript behavior, and reduced-motion support.
- `WorkhorseFeatures.astro` owns the animated, keyboard-accessible feature tabs. Without JavaScript, all feature panels remain available.
- Product inquiry links use the URL-encoded full model name in `/contact?vehicle=`. Retain preselection, submission UUID reuse on retry, the honeypot, Turnstile, and accessible error/success feedback when changing the contact UI.

## Photos and local-only files

- Permanent responsive images live in `public/workhorse-pro/` and `public/sparrow-plus/`, with 640/1280/1920px WebP variants. Photo components and model photo data provide responsive markup and alt text.
- Review both the actual image and current copy before changing alt text. Hero photos load eagerly; other photos load lazily. Keep PhotoSwipe dimensions accurate when replacing assets.
- The temporary `10:22 Workhorse Pro Selected/` camera originals and unused `public/three-uilas-logo-compact-print-transparent.png` were intentionally left untracked. Preserve them and do not sweep them into commits.
- See [IMAGE_OPTIMIZATION.md](IMAGE_OPTIMIZATION.md) before using legacy image scripts; they do not generate the current responsive product sets.

## Validation and handoff

- Use pnpm and Node.js 22.12.0 or newer. Standard checks are `pnpm check` and `pnpm build`; generated Worker types and build output remain untracked.
- For UI changes, verify the affected interactions and narrow layouts, including 320px and 390px. Check keyboard access and reduced motion when changing animation.
- A static `dist/client/` preview cannot test the Worker contact API. Mocked form success does not establish real queue processing or email delivery. Do not send live test messages without explicit authorization.
- No permanent browser-test dependency or suite is installed. Do not assume temporary `/tmp` scripts, screenshots, or another checkout’s browser dependencies are available.
- Rebuilds/checks during an active development preview caused stale Vite module URLs in redesign QA. Restart that preview before diagnosing module 404s, or use the completed `dist/client/` build for frontend-only checks.
- Report deployment as verified only with deployment evidence. A source push and local build are not deployment verification.
- Keep [docs/event-readiness-review.md](docs/event-readiness-review.md) current when outstanding work is completed; its earlier pre-redesign findings have been superseded.
