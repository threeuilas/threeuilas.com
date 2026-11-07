# Conference promotion disclosure review

Reviewed November 6, 2026 against [HRS §481B-1.6, official Hawaiʻi Legislature text](https://data.capitol.hawaii.gov/hrscurrent/Vol11_Ch0476-0490/HRS0481B/HRS_0481B-0001_0006.htm), the [user-supplied Justia copy](https://law.justia.com/codes/hawaii/title-26/chapter-481b/section-481b-1-6/), and [HAR chapter 16-303, DCCA advertising rules](https://www.cca.hawaii.gov/ocp/har/303-ads/). This records implementation changes and unresolved decisions; it is not a legal compliance certification or a substitute for review of the discount-only award structure by Hawaiʻi counsel.

## Scope and material findings

The statute’s subsections (b)–(d) concern mailed and telephone prize offers. Subsection (e)(1) addresses chance-based promotions that may not award every offered prize and calls for conspicuous advance disclosure of possible non-award and the winner-determination date. Per the user’s later presentation request, the website renders the full disclosures once, visibly before submission, with a hero anchor link. The block is not collapsed or moved to a separate page.

HAR §16-303-5 concerns conditions attached to free-value offers; §16-303-6 concerns price comparisons, including disclosure of compared prices. The page now explains that the award is a purchase discount and displays both the current vehicle price and the price after the discount beside each savings example. This implementation does not establish that a discount-only prize satisfies every applicable law or advertising rule.

## Implemented

- Entry and receipt of the discount award require no purchase or payment. The page distinguishes this from buying a vehicle to use the discount.
- The award is one 15% vehicle-purchase discount with add-ons eligible. The page does not advertise a free vehicle or promise a discount to every entrant.
- The public odds explanation uses plain language: equal chances in the first drawing, chances depending on entry count and acceptance, and random replacements from entries not previously selected. Purchases, social follows, newsletter subscriptions, and conference attendance are not used in selection. The drawing copy explains the closing date, first selection shortly afterward, and replacements after a decline or missed 48-hour deadline; scheduling internals remain in technical documentation.
- The November 10, 2026, 5:00 p.m. HST entry cutoff and selection at or shortly after that time appear before submission.
- The no-accepted-entry outcome is disclosed. The scheduler records and reports that outcome rather than inventing a winner.
- The 48-hour acceptance window, 30-day use period, full pre-tax subtotal treatment including delivery, and the replacement process are disclosed. A public online entry method is explained, and the sponsor is identified as Three Uilas LLC. A postal contact for participation information follows the address already published in the site’s privacy policy. The ordinary 808 number is not represented as toll-free.
- Price comparisons show $6,500 less 15% = $5,525 for Workhorse Pro and $3,500 less 15% = $2,975 for Sparrow+, computed from shared product data. These are vehicle-price calculations, not a confirmed total including every possible charge.

Disclosure copy lives in `src/data/conference.ts`; `ConferenceDisclosures.astro` renders it once before the submit button; the hero links to that block. New entry data does not collect street addresses. Existing entries and draw results are preserved. There are no added entry fees, required follows, or marketing-subscription requirements.

## Confirmed owner terms and legal review

These content and workflow changes are live in deployment `77bff4c3-d2e2-4b83-8a95-164bc91d9c0e`. Fifteen workflow tests, project checks, builds, responsive browser checks, and isolated Worker response tests passed. Production checks did not create entries or send mail. Those verification results establish implementation behavior, not legal clearance.

The owner confirmed 15% off all pre-tax line items including delivery; tax is excluded. Each notification gives 48 hours to accept. A decline or timeout triggers a random replacement from the remaining lot. An accepted discount must be used within 30 days. The current implementation keeps selection automatic and internal: automated result emails go only to Three Uilas, and staff manually contact selected entrants and record contact and responses in ops. The acceptance period starts at actual contact; pending selections do not expire before contact. Durable round and staff-action history retains deadlines and excludes all previously selected entrants from replacements. Do not add an unconfirmed cash alternative, restriction on combining offers, or eligibility condition.

The discount-only structure still warrants Hawaiʻi legal review because using the award requires a purchase. Free-entry wording does not, by itself, establish that the underlying structure complies with every applicable rule. Counsel should also review how the contingent replacement-drawing schedule satisfies the statute’s winner-determination-date disclosure. See [DCCA’s prize and telemarketing guidance](https://www.cca.hawaii.gov/ocp/scams/). Do not describe this technical/content review as legal certification.

Before using the drawing offer in mailed notices or telephone sales, disclose the actual applicable product price, delivery quote, and every material charge as required by subsections (b)–(d). Do not assume a website link alone supplies every disclosure, label a local phone number toll-free, or promise a mail-in entry process that has not been implemented.

## Reuse in other promotional materials

Use the disclosure statements from the shared conference data beside every new drawing offer, including odds, the selection date, possible non-award, and the distinction between free entry and purchase-dependent redemption. Include the confirmed 48-hour acceptance period, 30-day use period, and pre-tax subtotal treatment including delivery. A small footnote or a link alone should not replace a conspicuous explanation next to the offer.

The existing product flyers, business cards, and vehicle signs are separate from the drawing promotion. Their editable sources and text extracted from all nine existing print PDFs contain no 15%-drawing, winner, raffle, or sweepstakes offer. The promotion review does not certify all other claims in those documents or other laws beyond this scope.
