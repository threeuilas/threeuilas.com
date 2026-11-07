# Three Uilas project memory

Read [README.md](README.md) for routes, source locations, local commands, and verification scope. This file records project decisions for future sessions; current user instructions and edits take precedence.

## Business and content

- Three Uilas is locally owned and operated in **Hilo, Hawaiʻi**. Do not restore the former Orchidland Estates location.
- The website and vehicle flyers use **(808) 300-0605**. Call and text links use `+18083000605`; display signs intentionally omit the phone number.
- Preserve the mission exactly: **“Our mission is to transform Hawaiʻi agriculture, one uila at a time.”**
- Our story intentionally has no “What matters to us” section; that content duplicated the rest of the site.
- Keep prose short, direct, and practical. Emphasize real work, all-steel construction, easy maintenance, and local ownership.
- Preserve user-edited product copy. When features change, review image alt text and related page specifications alongside it.
- Emphasize the **Sparrow+ compact footprint** and foldable rear seat rather than making a practical steel bed its main feature.
- Sparrow+ looks the same as the original Sparrow. Existing photos can be used without an “original Sparrow shown” disclaimer. New Sparrow+ photography is pending.
- Workhorse Pro copy includes high-brightness LED headlights with high/low beams, low-range gearing, and a two-inch hitch ball. Alt text should identify those parts accurately without inventing what a photo demonstrates.
- Use `src/data/products.ts` for shared model prices and specifications. The user confirmed **1,500 lb cargo capacity for the Workhorse Pro** for its trade-show flyer. Do not infer other current-model payload or towing ratings from sold-out original-model figures.
- The user confirmed **600 lb total weight capacity for the Sparrow+, excluding vehicle weight**. Keep this qualification with the capacity in specifications.
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
- The Contact vehicle dropdown labels the original Workhorse and Sparrow as “discontinued” while keeping their existing option values for inquiry links and submissions.
- `ContactTurnstile.astro` uses Cloudflare's flexible widget at container widths of 300px or more, with a compact fallback below that width. Keep the iframe at its supported dimensions; do not scale or crop it. Resizing across the threshold removes the old widget before rendering a replacement so the form retains one response field.

## Photos and local-only files

- Permanent responsive images live in `public/workhorse-pro/` and `public/sparrow-plus/`, with 640/1280/1920px WebP variants. Photo components and model photo data provide responsive markup and alt text.
- Review both the actual image and current copy before changing alt text. Hero photos load eagerly; other photos load lazily. Keep PhotoSwipe dimensions accurate when replacing assets.
- The temporary `10:22 Workhorse Pro Selected/` camera originals and unused `public/three-uilas-logo-compact-print-transparent.png` were intentionally left untracked. Preserve them and do not sweep them into commits.
- See [IMAGE_OPTIMIZATION.md](IMAGE_OPTIMIZATION.md) before using legacy image scripts; they do not generate the current responsive product sets.

## Validation and handoff

- The Hawaiʻi Agriculture Conference page is `/conference`; see [docs/conference.md](docs/conference.md). Event dates are November 9–10, 2026. The user requested entries open immediately on November 6; do not restore the former November 9 opening. Entries close and the automatic drawing is due **November 10 at 5:00 p.m. HST**. `src/data/conference.ts` is the source of truth. The offer is a chance at **15% off the entire pre-tax subtotal for one three uila, including all line items, add-ons, and delivery; tax excluded**.
- The conference uses a separate `CONFERENCE_DB` D1 database, also bound by the authenticated ops application. Preserve entries, the initial snapshot, round history, and append-only staff actions. `src/worker.ts` delegates HTTP to Astro and runs the five-minute scheduler. All automated drawing emails go ONLY to **info@threeuilas.com**, with a link to the selected ops lead. Staff contact entrants manually and record notification/acceptance/decline in ops. Pending selections never expire before contact. A selected entrant has **48 hours after actual notification** to accept, then **30 days after acceptance** to use the discount. Social follows remain optional. Declines/timeouts trigger random replacements excluding every previously selected entrant. Repeated jobs must not reroll an active or accepted selection. Deploy the ops consumer before a new producer contract; legacy entry retries must retain their exact payload/hash.
- The conference page intentionally uses a standalone, full-width design with an oversized **15% OFF** offer over a full-width Workhorse Pro photo and a neutral charcoal gradient for contrast and a red “Your choice of uila” banner. Keep Instagram/Facebook links in the opening hero, before the entry form, plus the post-entry follow reminder. The image is the text background, not a separate adjacent panel. Savings examples derive from shared model prices. Do not collect street addresses in new entries; keep existing stored entry payloads and queued-note compatibility intact. The standard site header and footer remain on other pages.
- Per the user’s preference, render the full promotion disclosures **once**, visibly before the form’s submit button; the hero links to `#drawing-disclosures`. Do not duplicate the full block in the hero. Disclosure text comes from `conferenceDisclosures` in `src/data/conference.ts`. Display reference prices with savings examples. See [docs/conference-promotion-review.md](docs/conference-promotion-review.md) for the statute review and confirmed owner terms; do not claim legal certification, invent redemption terms, or treat free-entry wording as resolving the purchase-dependent discount-award structure.
- Explain public odds and replacement drawings in plain language. Keep formulas and the five-minute scheduler interval in technical documentation; entrants need the drawing date and their 48-hour response deadline.
- Run `pnpm test:conference` for isolated validation, SQLite, selection, and mocked notification checks. Do not run live notification-email tests or insert production test entries without explicit authorization. Keep `CONFERENCE_DRAW_SECRET` private and stable while emailed links remain in use.

- Use pnpm and Node.js 22.12.0 or newer. Standard checks are `pnpm check` and `pnpm build`; generated Worker types and build output remain untracked.
- For UI changes, verify the affected interactions and narrow layouts, including 320px and 390px. Check keyboard access and reduced motion when changing animation.
- A static `dist/client/` preview cannot test the Worker contact API. Mocked form success does not establish real queue processing or email delivery. Do not send live test messages without explicit authorization.
- No permanent browser-test dependency or suite is installed. Do not assume temporary `/tmp` scripts, screenshots, or another checkout’s browser dependencies are available.
- Rebuilds/checks during an active development preview caused stale Vite module URLs in redesign QA. Restart that preview before diagnosing module 404s, or use the completed `dist/client/` build for frontend-only checks.
- Report deployment as verified only with deployment evidence. A source push and local build are not deployment verification.
- Keep [docs/event-readiness-review.md](docs/event-readiness-review.md) current when outstanding work is completed; its earlier pre-redesign findings have been superseded.
