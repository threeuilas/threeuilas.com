export const workhorsePhotos = {
	'cabin-front-wide': { alt: 'Green Workhorse Pro parked beside a red A-frame cabin among trees in Hawaiʻi.', portrait: false },
	'front-right-road-action': { alt: 'Workhorse Pro coming around a bend on a tree-lined private road.', portrait: false },
	'front-right-far-action': { alt: 'Workhorse Pro approaching along a quiet road beneath tall trees.', portrait: true },
	'rear-action': { alt: 'Workhorse Pro heading down a tree-lined road, seen from behind.', portrait: true },
	'side-dump': { alt: 'Side view of the Workhorse Pro with its five-foot cargo bed raised.', portrait: false },
	'rear-right-close': { alt: 'Steel cargo bed and tailgate on the green Workhorse Pro.', portrait: false },
	'hydraulics': { alt: 'Hydraulic cylinder underneath the raised Workhorse Pro dump bed.', portrait: true },
	'latch-hand-model': { alt: 'Hands on the latch of a Workhorse Pro drop-down cargo-bed panel.', portrait: true },
	'battery': { alt: '72V, 10.1 kWh lithium iron phosphate battery beneath the Workhorse Pro cargo bed.', portrait: false },
	'motor-and-diff': { alt: '1,800-watt electric motor and rear differential beneath the Workhorse Pro cargo bed.', portrait: false },
	'low-range': { alt: 'Low-range gear lever beside the Workhorse Pro driver’s seat.', portrait: false },
	'headlights': { alt: 'Close-up of the Workhorse Pro’s illuminated high-brightness LED headlight.', portrait: true },
	'instrument-display': { alt: 'Workhorse Pro digital instrument display showing speed and battery charge.', portrait: false },
	'left-handle-hand-model': { alt: 'Hand operating the Workhorse Pro handlebar switches for the headlights and hydraulic dump bed.', portrait: false },
	'tow-hitch-near': { alt: 'Two-inch tow hitch ball mounted below the Workhorse Pro tailgate.', portrait: false },
	'front-left-wide': { alt: 'Full view of the green Workhorse Pro with its windshield, roof, and cargo bed.', portrait: false },
	'rear-right-dump-wide': { alt: 'Workhorse Pro raised dump bed seen from the rear, with the tailgate open.', portrait: false },
} satisfies Record<string, { alt: string; portrait: boolean }>;

export type WorkhorsePhotoName = keyof typeof workhorsePhotos;

export const workhorseFeatures: {
	id: string;
	label: string;
	kicker: string;
	title: string;
	description: string;
	image: WorkhorsePhotoName;
	details: { image: WorkhorsePhotoName; title: string; description: string }[];
}[] = [
	{
		id: 'cargo',
		label: 'Haul & unload',
		kicker: 'Included on every Pro',
		title: 'Hydraulic dump bed.',
		description: 'Carry tools, feed, and material in the five-foot steel bed. Use the hydraulic lift to unload loose material.',
		image: 'side-dump',
		details: [
			{ image: 'hydraulics', title: 'Hydraulic lift', description: 'The hydraulic cylinder raises the cargo bed, making unloading loose material effortless.' },
			{ image: 'latch-hand-model', title: 'Drop-down panels', description: 'Latching side panels and a drop-down tailgate give you access to the bed for loading and unloading.' },
			{ image: 'tow-hitch-near', title: 'Tow hitch', description: 'Pull a small trailer or equipment around your property where no pickup can access' },
		],
	},
	{
		id: 'electric',
		label: 'Electric power',
		kicker: '1,800W motor · 10.1 kWh battery',
		title: 'All-electric power.',
		description: 'The Pro has 50% more motor power and twice the maximum range of the original Workhorse. Charge with the included plug-in wall charger.',
		image: 'front-right-road-action',
		details: [
			{ image: 'battery', title: 'Lithium battery', description: 'The 72V lithium iron phosphate system stores 10.1 kWh of energy, with a maximum range of up to 120 miles. Actual range depends on load, terrain, and use.' },
			{ image: 'motor-and-diff', title: 'Rear-wheel drive', description: 'The 1,800-watt electric motor drives the rear axle. Accessible mechanical components support maintenance and repair.' },
			{ image: 'low-range', title: 'Low-range Gear', description: 'Low-range gear for heavy loads and steep terrain.' },
		],
	},
	{
		id: 'driver',
		label: 'Everyday details',
		kicker: 'Cabin & controls',
		title: 'Simple controls.',
		description: 'A roof and windscreen provide partial shelter. Open sides make getting in and out easy, with controls on the handlebars.',
		image: 'front-left-wide',
		details: [
			{ image: 'instrument-display', title: 'Digital display', description: 'Check your speed and remaining battery charge on the digital instrument display.' },
			{ image: 'left-handle-hand-model', title: 'Handlebar controls', description: 'The handlebar-mounted switches keep lighting and hydraulic bed controls near your hands.' },
			{ image: 'headlights', title: 'High-brightness LED headlights', description: 'High-brightness LED headlights are standard on the Pro with high and low beam settings.' },
		],
	},
];
