export const workhorsePro = {
	name: 'Three Uilas Workhorse Pro',
	learnMoreLink: '/products/workhorse-pro',
	description: 'The next evolution of the Workhorse. Get even more done with double the range, 50% more power, and included hydraulic dump bed.',
	colors: [
		{ name: 'Tractor Red', hex: '#db1100' },
		{ name: 'Blaze Orange', hex: '#ff914d' },
		{ name: 'Forest Green', hex: '#457a00' },
		{ name: 'Ocean Blue', hex: '#0081cc' },
		{ name: 'Coastal Aqua', hex: '#2ee6e3' },
	],
	images: ['/workhorse-pro/front-right-road-action-1280.webp', '/workhorse-pro/side-dump-1280.webp', '/workhorse-pro/cabin-front-wide-1280.webp'],
	dark: true,
	specs: [
		{ label: 'Bed Size', value: '5ft' },
		{ label: 'Motor', value: '1800W' },
		{ label: 'Battery System', value: '72V Lithium Iron Phosphate' },
		{ label: 'Battery Capacity', value: '10.1 kWh' },
		{ label: 'Maximum Range', value: '120 miles' },
		{ label: 'Top Speed', value: '25 mph' },
		{ label: 'Special Features', value: 'Hydraulic Auto-Dump Bed<br />Partially Enclosed Wind/Rain Screen<br />Upgraded Headlights<br />Tow Hitch' },
		{ label: 'Availability', value: 'Available for Purchase' },
	],
	pricing: {
		originalPrice: 6500,
		discountedPrice: 6500,
		discountAmount: 0,
	},
};

export const sparrowPlus = {
	name: 'Three Uilas Sparrow+',
	learnMoreLink: '/products/sparrow-plus',
	description: 'The upgraded Sparrow with a bigger motor and a lithium battery pack for more range.',
	images: ['/sparrow-plus/side-front-1280.webp', '/sparrow-plus/side-1280.webp', '/sparrow-plus/rear-seat-1280.webp'],
	dark: true,
	specs: [
		{ label: 'Bed Size', value: '3ft 6in' },
		{ label: 'Motor', value: '1000W' },
		{ label: 'Battery System', value: '72V Lithium Iron Phosphate' },
		{ label: 'Battery Capacity', value: '4.7 kWh' },
		{ label: 'Maximum Range', value: '35 miles' },
		{ label: 'Top Speed', value: '25 mph' },
		{ label: 'Special Features', value: 'Foldable Rear Seat' },
		{ label: 'Availability', value: 'Available for Purchase' },
	],
	pricing: {
		originalPrice: 3500,
		discountedPrice: 3500,
		discountAmount: 0,
	},
};

export const availableProducts = [workhorsePro, sparrowPlus];

export const products = [
	...availableProducts,
	{
		name: 'Three Uilas Workhorse',
		description: 'Heavy-duty three uila built for hauling and farm work. Optional hydraulic auto-dump bed makes hauling material a breeze.',
		images: [
			'/gallery/workhorse/workhorse-3-colors-1.webp',
			'/gallery/workhorse/workhorse-red-front.webp',
			'/gallery/workhorse/workhorse-red-front-portrait.webp',
			'/gallery/workhorse/workhorse-red-side-view.webp',
			'/gallery/workhorse/workhorse-red-side-down.webp',
			'/gallery/workhorse/workhorse-red-side-down-1.webp',
			'/gallery/workhorse/workhorse-red-side-dump-alt-3.webp',
			'/gallery/workhorse/workhorse-green-front.webp',
			'/gallery/workhorse/workhorse-green-side.webp',
			'/gallery/workhorse/workhorse-green-side-dump.webp',
			'/gallery/workhorse/workhorse-orange-side.webp',
		],
		specs: [
			{ label: 'Bed Size', value: '5ft' },
			{ label: 'Motor', value: '1200W' },
			{ label: 'Battery System', value: '72V AGM Deep Cycle' },
			{ label: 'Maximum Range', value: '60 miles' },
			{ label: 'Top Speed', value: '25 mph' },
			{ label: 'Special Features', value: 'Optional Hydraulic Auto-Dump Bed<br />Partially Enclosed Wind/Rain Screen' },
		],
		pricing: {
			withDumpBed: {
				originalPrice: 5500,
				discountedPrice: 5500,
				discountAmount: 0,
				soldOut: true,
			},
			withoutDumpBed: {
				originalPrice: 4500,
				discountedPrice: 4500,
				discountAmount: 0,
				soldOut: true,
			},
		},
	},
	{
		name: 'Three Uilas Sparrow',
		description: 'Compact and versatile three uila perfect for zipping around the neighborhood with room for a passenger and a small amount of cargo.',
		images: [
			'/gallery/sparrow/sparrow-front.webp',
			'/gallery/sparrow/sparrow-side-front.webp',
			'/gallery/sparrow/sparrow-side.webp',
			'/gallery/sparrow/sparrow-rear.webp',
			'/gallery/sparrow/sparrow-rear-seat.webp',
		],
		specs: [
			{ label: 'Bed Size', value: '3ft 6in' },
			{ label: 'Motor', value: '650W' },
			{ label: 'Battery System', value: '48V AGM Deep Cycle' },
			{ label: 'Maximum Range', value: '20 miles' },
			{ label: 'Top Speed', value: '25 mph' },
			{ label: 'Special Features', value: 'Foldable Rear Seat' },
		],
		pricing: {
			originalPrice: 3000,
			discountedPrice: 3000,
			discountAmount: 0,
			soldOut: true,
		},
	},
];
