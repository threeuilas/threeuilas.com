# Event readiness after the site redesign

November 7 release: the conference landing page, ops lead integration, internal-only automatic drawing and gallery improvements are deployed. The page has a neutral charcoal photo background, higher social links and a red “Your choice of uila” banner. Each new entry creates a lead with email, phone and farming details. Staff manually contact selected entrants and record contact/responses in ops; automatic result emails go only to the team. Conference migration 0003 preceded ops deployment, then the public producer deployed. Local tests, builds and desktop/mobile workflows pass. See [production release evidence](conference.md).

Updated November 6, 2026. This review tracks the path from seeing a Three Uila to comparing a model and contacting the business. It replaces earlier findings that described the site before the visual redesign.

The redesign source was committed and pushed in `173b1e0` on `main`. Local builds and browser checks passed. This review does not establish the state of the live deployment, event traffic capacity, lead processing, or notification delivery.

## Improvements completed

| Visitor need | Current implementation |
| --- | --- |
| Recognize the available vehicles | Photo-led homepage, dedicated Workhorse Pro and Sparrow+ pages, and responsive product photography. Existing Sparrow photos are used for Sparrow+ because the user confirmed the appearance is the same. New Sparrow+ photography remains a future update. |
| Compare current models | A shared model presentation and a comparison table that shows both models on narrow screens. Sold-out original models are retained in a separate expandable reference section. |
| Inspect product details | Every photo on each product page opens a shared model gallery, including photos in inactive feature tabs. Repeated photos appear once; feature images preserve the vehicle and close-up details. |
| Understand the main features | Workhorse Pro tabs explain hauling, electric power, and controls. Sparrow+ emphasizes compact size, a foldable rear seat, and electric utility. Specifications and range qualifications are visible. |
| Find a model and make contact | Products groups both models in the header. Product inquiry links preselect the model in the contact form. Call, text, and email options are presented beside the form. |
| Understand local ownership | The homepage, Our story, Contact, and footer identify Hilo, Hawaiʻi. Our story uses the mission: “Our mission is to transform Hawaiʻi agriculture, one uila at a time.” |
| Read consistent buying information | “Delivery available” appears near relevant inquiries. Additional-fee explanations are confined to FAQs. Unverified current-model load ratings are not inferred from the original models. |
| Use the interface by keyboard or on a phone | Shared FAQ/disclosure components, rotating indicators, animated opening and closing, native no-JavaScript fallbacks, and reduced-motion support. The product name in each sticky section bar returns to the page top. |
| Read form feedback | Errors use `role="alert"`; success uses `role="status"`. Mocked browser checks covered error, retry, success, stable submission identifiers, and model preselection. |

The common visual language now covers all six marketing pages: warm neutral backgrounds, dark green sections, red primary actions, condensed headings, and system-font body copy. The earlier recommendation to postpone a broader redesign is complete and no longer an implementation plan.

## Remaining work before event promotion

| Priority | Remaining gap | Next step |
| --- | --- | --- |
| Before distributing links | The public deployment and mobile network behavior have not been verified in this session. | Check the live product pages and contact flow on actual phones and cellular data. Verify any printed QR destination before printing. Measure loading behavior on realistic connections. |
| Before relying on inquiries | Mocked UI checks do not verify Turnstile, Worker bindings, queue consumption, Resend delivery, or follow-up. | Run an explicitly authorized integration test with the real deployment and confirm receipt and handling. Inspect failures without exposing secrets or visitor information. |
| Form follow-up | The form uses `novalidate`, has no client-side required-field validation, does not move focus to feedback, and does not reset expired or consumed Turnstile tokens. | Add validation and focus handling appropriate to the existing server validation. Exercise verification expiry and real retry behavior before changing token handling. |
| Conference promotion | `/conference` is published and captures contact and farming details with durable event attribution, social links, an automatic drawing, and a result/reminder email to `info@threeuilas.com`. | See [conference behavior and deployment evidence](conference.md). Live captcha, queue consumption, and inbox delivery remain integration checks. |
| Purchase logistics | Pickup arrangements, payment options, and delivery coverage are not fully documented. | Confirm those operational details before adding promises to the site. Keep fee explanations in FAQs. |
| Current-model load ratings | Published carrying capacities in the catalog FAQ identify the original models. | Confirm Workhorse Pro and Sparrow+ payload and towing ratings before adding current-model figures. |
| Photography refresh | Dedicated new Sparrow+ photos are pending. | Replace the responsive Sparrow+ assets and review crops, dimensions, captions, and alt text together. |

## Verified locally

The public Odds and Drawing text now uses plain language, keeping scheduling implementation details in technical documentation. Live checks at 320px, 390px, and 1440px verified the revised text, one complete disclosure block, and no horizontal overflow. The 48-hour acceptance period and drawing behavior are unchanged.

At the user’s request, the full disclosure block now appears once before submission, with a hero link to its labeled, keyboard-focusable section. Browser checks at 320px, 390px, 768px, and 1440px verified the single block, fragment link/focus, all disclosure text, and the existing form flow. The terms and drawing workflow are unchanged.

The promotion now has conspicuous free-entry, odds, selection-date, possible non-award, full pre-tax subtotal, and acceptance/use disclosures beside the offer and before submission. The owner confirmed delivery is discountable, tax is excluded, acceptance lasts 48 hours, and use lasts 30 days after acceptance. Fifteen tests cover signed responses, deadline boundaries, final accepted awards, and random replacements excluding previously selected entrants. An isolated real Worker verified the response page/API and native forms at 320px, 390px, and 1440px with no outbound email or production rows. Public form/disclosure checks passed at 320px, 390px, 768px, and 1440px. All nine existing print PDFs were checked for drawing offers; none contains one. See [the focused statute review](conference-promotion-review.md) for legal scope and limitations.

The conference redesign uses a full-height red offer, oversized 15% discount typography, vehicle photography, and model savings computed from shared prices. The street address field and new-entry collection were removed. Mocked browser checks passed at 320px, 390px, 768px, and 1440px for the hero, entry links, both form steps, validation, Back, error/retry, feedback focus, token reset, social links, and absence of street addresses from submissions. Opening/closed states, a 320px view with JavaScript and web fonts unavailable, and the unchanged homepage header/footer also passed. All nine conference tests, project checks, and the production build passed.

At the user’s request on November 6, conference entries were enabled immediately in production ahead of the November 9–10 event. Live checks at 320px, 390px, and 1440px confirmed the form is open; a missing-captcha request confirmed the API passes its opening gate without saving an entry. The November 10, 5:00 p.m. HST cutoff, automatic drawing, and result/reminder email remain configured. See the deployment evidence in [conference.md](conference.md).

On November 6, the conference form passed browser checks at 320px, 390px, 768px, and 1440px using mocked submissions and captcha. Opening/closed states, validation, both steps, Back, error/retry, input preservation, captcha reset, feedback focus, social links, no-JavaScript help, and overflow passed. Nine isolated tests cover conference validation, deadline enforcement at the database write, duplicate emails, downstream payload compatibility, random selection, overlapping/repeated jobs, email failure/retry, empty draws, and pending lead forwarding. The separate production D1 database was created and its migration applied. These checks did not send live messages or insert production test entries.

On November 4, product-gallery checks covered every product photo, including all Workhorse Pro feature tabs, at 390px and 1440px. Layout checks also covered 320px, 768px, and 900px. Image dimensions, duplicate removal, full-frame feature photos, keyboard opening and navigation, zoom, focus return, touch swiping, reduced motion, and direct image links without JavaScript passed for both models. These checks did not submit contact forms.

Browser checks during the redesign covered layouts at 320px, 390px, 768px, and 1440px; model navigation; photo loading and galleries; inquiry preselection; and mocked contact error/retry/success states. Follow-up checks covered product-name back-to-top links, animated FAQs and the original-model archive, Products and mobile navigation, keyboard operation, rapid toggling, reduced motion, and native no-JavaScript behavior.

On October 24, the contact captcha was checked with Cloudflare's actual public test widget at widths from 320px to 1440px, including resizing across the compact/flexible threshold. Checks confirmed one response field, no horizontal overflow, preserved model preselection and submission UUID, and a token in an intercepted local form submission. The original Workhorse and Sparrow dropdown labels now identify them as discontinued. These checks do not establish production token verification or message delivery.

Astro checks and production builds passed. Two existing unused-variable hints remain in `scripts/move-originals.js`. Browser scripts and screenshots were temporary development artifacts; there is no committed browser-test suite. Live messages were not sent during those mocked checks.

## Event visitor flow

The conference flow is: event QR link → `/conference` → contact and farming details → saved entry and social follow links → automatic drawing after the November 10, 5:00 p.m. HST cutoff → result/reminder email to the team → winner follow-up. Current-model pages and direct contact remain available through the shared navigation.
