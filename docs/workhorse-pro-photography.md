# Workhorse Pro product page

The dedicated page is at `/products/workhorse-pro`. Product pricing and specifications come from `workhorsePro` in `src/data/products.ts`. Feature content and descriptive photo text live in `src/data/workhorse-pro.ts`.

## Photo selection

All 22 photos in `10:22 Workhorse Pro Selected` were reviewed. The page uses 17 of them, balancing images that establish a setting with close-ups that explain a feature.

- **Opening image:** `cabin-front-wide`. The red cabin contrasts with the green vehicle, and the left side provides space for the title without covering the cargo bed or front wheel.
- **Overview:** `front-right-far-action`. The vertical composition gives the property and surrounding trees room in the layout.
- **Hauling:** `side-dump`, `hydraulics`, `latch-hand-model`, and `tow-hitch-near`. The side view explains the bed lift; close-ups show the hydraulic cylinder, panel latch, and included hitch.
- **Electric power:** `front-right-road-action`, `battery`, `motor-and-diff`, and `low-range`. The action image leads into the battery and mechanical components that support the feature description.
- **Driver details:** `front-left-wide`, `instrument-display`, `left-handle-hand-model`, and `headlights`. These connect the overall cabin design with its display, switches, and lighting.
- **Gallery:** `front-right-road-action`, `rear-action`, `rear-right-close`, and `rear-right-dump-wide`. These show the vehicle in use and provide additional cargo-bed views. Selecting an image opens the full-screen viewer.

`front-right-dump-wide` and `right-left-dump` repeat views already explained by the side and rear dump images. `rear-right-wide` overlaps with the closer cargo-bed image. `brake-lights` and `rear-view-mirror` show supporting details that do not need separate feature sections.

## Image delivery

Permanent assets are in `public/workhorse-pro`, independent of the temporary source folder. Each selected image has 640, 1280, and 1920-pixel-wide WebP versions. Original proportions are preserved. Responsive image markup selects the appropriate size; the opening image loads eagerly and other images load lazily. The original camera JPEGs remain unchanged.

## Content and interactions

The page follows an overview → features → gallery → specifications → ownership questions → inquiry progression. It uses the existing red brand accent and typeface with warm neutral and dark green backgrounds drawn from the photography.

The feature explorer supports pointer and keyboard navigation. Without JavaScript, all feature sections remain visible. FAQs use the shared [QuestionList](../src/components/QuestionList.astro) and [Disclosure](../src/components/Disclosure.astro) components. Gallery links work as direct image links without JavaScript. Purchase links open the existing contact form with Workhorse Pro selected.

The section navigation provides Overview, Features, Gallery, and Specs links. The sticky Workhorse Pro name links to `#page-top`, above the global header. Additional section-jump arrows have been removed. Feature tabs animate the indicator, image, copy, and detail photos, with immediate changes for visitors who prefer reduced motion. Cross-page text links use a continuous border instead of underlining separate text and arrow elements.

Updated feature copy identifies low-range gearing, a two-inch hitch ball, and high-brightness LED headlights with high/low beams. Related image alt text reflects those details while describing what the photo actually shows. Preserve user-edited copy when updating descriptions or assets.

## Shared site design

The homepage, catalog, both product pages, Our story, and Contact use the same warm neutral backgrounds, dark green sections, red accents, and typography. `ModelPreview.astro` provides the shared model presentation. The catalog compares available models and retains sold-out original models in an expandable reference section.

Navigation groups All models, Workhorse Pro, and Sparrow+ under Products. Our story and Get in touch remain primary links; the logo returns home. The same structure works on mobile and without JavaScript.

Questions and the original-model archive share `Disclosure.astro`. The Products menu uses the same controller in [disclosures.ts](../src/scripts/disclosures.ts). Opening and closing animate, plus/X indicators and menu chevrons rotate, and mobile navigation also expands and collapses. Reduced-motion settings disable those transitions.

Sparrow+ shares its appearance with the original Sparrow, so the existing photography is used without an original-model caption. Responsive assets live in `public/sparrow-plus`; `src/data/sparrow-plus.ts` holds photo descriptions. These assets can be replaced when new photography arrives. The dedicated page is `/products/sparrow-plus`.

Sparrow+ feature copy emphasizes its compact footprint and foldable rear seat. Business-location references use Hilo, Hawaiʻi. The mission and other durable content decisions are recorded in [AGENTS.md](../AGENTS.md).

Maximum range is qualified next to the headline figure and in the specifications. The page does not assign an unverified towing or payload rating to the Pro.
