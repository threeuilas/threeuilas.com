# Event readiness after the site redesign

Updated October 23, 2026. This review tracks the path from seeing a Three Uila to comparing a model and contacting the business. It replaces earlier findings that described the site before the visual redesign.

The redesign source was committed and pushed in `173b1e0` on `main`. Local builds and browser checks passed. This review does not establish the state of the live deployment, event traffic capacity, lead processing, or notification delivery.

## Improvements completed

| Visitor need | Current implementation |
| --- | --- |
| Recognize the available vehicles | Photo-led homepage, dedicated Workhorse Pro and Sparrow+ pages, and responsive product photography. Existing Sparrow photos are used for Sparrow+ because the user confirmed the appearance is the same. New Sparrow+ photography remains a future update. |
| Compare current models | A shared model presentation and a comparison table that shows both models on narrow screens. Sold-out original models are retained in a separate expandable reference section. |
| Understand the main features | Workhorse Pro tabs explain hauling, electric power, and controls. Sparrow+ emphasizes compact size, a foldable rear seat, and electric utility. Specifications and range qualifications are visible. |
| Find a model and make contact | Products groups both models in the header. Product inquiry links preselect the model in the contact form. Call, text, and email options are presented beside the form. |
| Understand local ownership | The homepage, Our story, Contact, and footer identify Hilo, Hawaiʻi. Our story uses the mission: “Our mission is to transform Hawaiʻi agriculture with affordable, useful farm vehicles.” |
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
| Event attribution | There is no event-specific landing page or event-source field in the contact payload, and no analytics script is configured in the shared layout. | If event attribution is wanted, choose event URLs and a measurement approach, then preserve the source through the inquiry flow. |
| Purchase logistics | Pickup arrangements, payment options, and delivery coverage are not fully documented. | Confirm those operational details before adding promises to the site. Keep fee explanations in FAQs. |
| Current-model load ratings | Published carrying capacities in the catalog FAQ identify the original models. | Confirm Workhorse Pro and Sparrow+ payload and towing ratings before adding current-model figures. |
| Photography refresh | Dedicated new Sparrow+ photos are pending. | Replace the responsive Sparrow+ assets and review crops, dimensions, captions, and alt text together. |

## Verified locally

Browser checks during the redesign covered layouts at 320px, 390px, 768px, and 1440px; model navigation; photo loading and galleries; inquiry preselection; and mocked contact error/retry/success states. Follow-up checks covered product-name back-to-top links, animated FAQs and the original-model archive, Products and mobile navigation, keyboard operation, rapid toggling, reduced motion, and native no-JavaScript behavior.

Astro checks and production builds passed. Two existing unused-variable hints remain in `scripts/move-originals.js`. Browser scripts and screenshots were temporary development artifacts; there is no committed browser-test suite. Live messages were not sent during those mocked checks.

## Event visitor flow

A useful event flow is: event QR link → current-model comparison or product page → model-specific inquiry or direct call/text → confirmation and follow-up. Event-specific links and attribution remain proposed work, not implemented behavior.
