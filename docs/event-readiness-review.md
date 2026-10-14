# Website recommendations before upcoming events

The immediate goal is to help someone who has just seen a Three Uila recognize the vehicle, compare the available models, and make contact from a phone. Prioritize that path before a larger visual redesign.

This review is based on the repository's pages and contact flow. These are recommendations; no event landing page, analytics service, or broader redesign has been implemented. Mobile performance and traffic capacity have not been measured.

## Availability updates completed separately

- The homepage introduces both the Workhorse Pro and Sparrow+ as available for purchase, with prices, battery specifications, and model-specific contact links.
- The product page explicitly explains that both models can be purchased by contacting Three Uilas.
- Both pages use the same product data to keep specifications and prices consistent.

## Recommended priorities

| Priority | Finding | Recommended change | What is needed |
| --- | --- | --- | --- |
| Before events | Both current models have empty image galleries. The homepage carousel uses the earlier Workhorse and Sparrow photos. | Add real photos of the Workhorse Pro and Sparrow+, including the dump bed, tow hitch, battery, and rear seat where applicable. Label any representative photos clearly. | Current-model photos and confirmation of the configuration shown. |
| Before events | Call and text links appear below the contact form. A visitor must leave the product page and scroll to find them. | Add visible call/text options near the model purchase buttons and at the top of the contact page. Use a compact mobile action bar if it does not obscure content. Keep the form as another contact option. | Confirm the published phone number remains the right sales contact. |
| Before events | The homepage now compares a few specifications, but detailed cards mix current models with sold-out predecessors. | Add a concise Workhorse Pro versus Sparrow+ comparison covering intended use, bed size, battery capacity, range, features, and price. Put sold-out models in a separate section below the available models. | Confirm current-model load ratings before adding them; the existing FAQ names the older models. |
| Before events | There is no event-specific arrival or inquiry flow, and the contact payload does not record an event source. No analytics script is configured in the repository layout. | Create a short event landing page with both models, prices, call/text options, and a purchase inquiry. Use a distinct QR link for each event and preserve its source through the contact submission. Select and configure measurement before expecting attribution reports. | Event names, dates, destination URL, and a decision about analytics. |
| Before events | The contact form disables browser validation with `novalidate`. Its error and success messages have no live-region semantics, and failed submissions do not reset Turnstile. | Validate required fields before sending, make errors and success announcements accessible, focus the relevant message or field, and reset an expired or consumed verification token so visitors can retry. Test model preselection, phone and email inquiries, and failure recovery on actual phones. | A test run of the complete submission and follow-up process. |
| Next | Purchasing instructions do not explain pickup, delivery, payment, or what happens after an inquiry. | Add a short “How to buy” section with confirmed pickup/delivery coverage, payment options, and the purchase process. Explain the basis of range figures and warranty coverage. Keep intended-use information easy to find. | Confirm logistics, prices including any fees, charging guidance, and warranty terms. Avoid publishing unconfirmed promises. |
| Next | The header still uses the square logo with separate text; the new wide logo is not used. The general body typeface is condensed. | Use the wide transparent logo in the header, retain the compact mark for small placements, and use a more readable body typeface while keeping the condensed style for headings. Standardize buttons and reduce large empty card areas. | A visual preview at phone and desktop widths. |
| Before promotion | Static pages are built for Cloudflare, but this review does not establish how they perform on event Wi-Fi or whether inquiries are being received and followed up. | Test the actual QR codes and public pages on cellular data, measure mobile loading and layout shifts, verify the production deployment, and monitor contact errors and queue delivery during events. Confirm who handles incoming leads. | Production access for verification and an assigned lead owner. |

## Suggested event visitor flow

Event QR code → short page featuring both available models → comparison or direct call/text → model-specific purchase inquiry → confirmation and follow-up.

Keep the existing main site available for visitors who want full specifications and company information. A QR destination should answer the immediate questions without requiring several pages of navigation.

## Implementation order

1. Publish current-model photos and make phone/text contact easy to find.
2. Add the compact comparison and confirmed purchasing instructions.
3. Build the event landing page and configure event attribution.
4. Improve form validation, accessibility, and retry behavior.
5. Test the public journey on phones before printing QR materials.
6. Apply the broader typography and branding refresh after the purchase path works well.

## Reference guidance

Campaign parameters identify referring campaigns when a compatible analytics setup collects them. They do not create reporting on their own. See [Google Analytics campaign URL guidance](https://support.google.com/analytics/answer/10917952).

Accessible form labels, keyboard operation, and suitable autofill attributes support easier form completion. See [web.dev form design basics](https://web.dev/learn/forms/design-basics) and [autofill guidance](https://web.dev/learn/forms/autofill/).
