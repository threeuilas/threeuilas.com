export const conference = {
	id: 'hawaii-agriculture-conference-2026',
	name: 'Hawaiʻi Agriculture Conference',
	dates: 'November 9–10, 2026',
	opensAt: '2026-11-07T08:36:59.000Z',
	closesAt: '2026-11-11T03:00:00.000Z',
	deadline: 'November 10 at 5:00 p.m. HST',
	acceptanceHours: 48,
	redemptionDays: 30,
	termsVersion: '2026-11-07-v2',
} as const;

// Keep public and reusable promotional disclosures consistent with the actual drawing.
export const conferenceDisclosures = {
	freeEntry: 'No purchase or payment is required to enter or win the discount award. A purchase will not improve your chances.',
	reward: 'One accepted winner receives 15% off the entire pre-tax subtotal for one three uila of their choice. All line items, including add-ons and delivery, are included. Tax is excluded. Delivery is quoted for the requested destination. Receiving the discount award is free; using it requires buying the vehicle.',
	odds: 'All valid entries have an equal chance in the first drawing. Your chances depend on how many entries we receive and whether selected entrants accept the discount. If a replacement is needed, we draw randomly from entries that haven’t already been selected. One entry per email address.',
	selection: 'Entries close November 10, 2026, at 5:00 p.m. HST. We’ll draw the first winner shortly afterward, and the Three Uilas team will contact them personally. If they decline or don’t accept within 48 hours of notification, we’ll draw another entry from those remaining. We’ll repeat as needed until someone accepts or all entries have been selected.',
	nonAward: 'The award may not be awarded if no accepted entries are received or if every selected entrant declines or lets their acceptance window expire.',
	claim: 'Each selected entrant has 48 hours after Three Uilas contacts them by email or phone to accept. A decline or missed deadline leads to a random replacement from the remaining entries. An accepted discount must be used within 30 days after acceptance.',
	optionalParticipation: 'Conference attendance, social follows, and newsletter subscriptions are not required and do not improve your chances.',
	entryInstructions: 'Enter without purchase or payment using the public form at threeuilas.com/conference before November 10, 2026, at 5:00 p.m. HST.',
	sponsor: 'Three Uilas LLC',
	informationAddress: '55 Kukuau St, Hilo, HI 96720',
} as const;

export const professions = ['Farmer / grower', 'Rancher', 'Homesteader / home gardener', 'Farm employee / manager', 'Landscaping / property management', 'Agriculture industry professional', 'Student / educator / researcher', 'Other'];
export const farmSizes = ['No farm / not yet farming', 'Less than 1 acre', '1–4 acres', '5–9 acres', '10–24 acres', '25–49 acres', '50–99 acres', '100+ acres'];
export const experienceLevels = ['Not farming yet', 'Less than 1 year', '1–3 years', '4–9 years', '10–19 years', '20+ years'];
export const islands = ['Hawaiʻi Island', 'Maui', 'Oʻahu', 'Kauaʻi', 'Molokaʻi', 'Lānaʻi', 'Other'];
export const modelInterests = ['Three Uilas Workhorse Pro', 'Three Uilas Sparrow+', 'Not sure yet'];
