import { conference, professions, farmSizes, experienceLevels, islands, modelInterests } from '../data/conference';

export interface ConferenceEntry {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	town: string;
	island: string;
	postalCode: string;
	organization: string;
	profession: string;
	farmSize: string;
	experience: string;
	vehicle: string;
	emailOptIn: boolean;
	termsVersion?: string;
	leadPayloadVersion?: 2;
}

export type EntryResult = { entry: ConferenceEntry; error?: never; field?: never } | { error: string; field: string; entry?: never };

export function validateConferenceEntry(data: FormData): EntryResult {
	const text = (key: string) => {
		const value = data.get(key);
		return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
	};
	const limits: [string, string, number, boolean][] = [
		['firstName', 'first name', 80, true], ['lastName', 'last name', 100, true],
		['email', 'email address', 254, true], ['phone', 'phone number', 40, true],
		['town', 'town / city', 100, true],
		['postalCode', 'ZIP / postal code', 20, false], ['organization', 'farm / business name', 150, false],
	];
	for (const [key, label, limit, required] of limits) {
		if ((required && !text(key)) || text(key).length > limit) return { error: `Enter your ${label} using ${limit} characters or fewer.`, field: key };
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email'))) return { error: 'Enter a valid email address.', field: 'email' };
	const digits = text('phone').replace(/\D/g, '');
	if (digits.length < 10 || digits.length > 15 || !/^\+?[\d\s().-]+$/.test(text('phone'))) return { error: 'Enter a valid phone number, including the area code.', field: 'phone' };
	for (const [key, options, label] of [
		['island', islands, 'island'], ['profession', professions, 'profession'],
		['farmSize', farmSizes, 'farm size'], ['experience', experienceLevels, 'farming experience'],
		['vehicle', modelInterests, 'model interest'],
	] as const) {
		if (!options.includes(text(key))) return { error: `Select your ${label}.`, field: key };
	}
	if (text('termsVersion') !== conference.termsVersion) return { error: 'The drawing terms have been updated. Reload this page and review the updated disclosures before entering.', field: 'termsVersion' };
	if (data.get('entryConsent') !== 'yes') return { error: 'Confirm that we may contact you about the drawing.', field: 'entryConsent' };
	return { entry: {
		firstName: text('firstName'), lastName: text('lastName'), email: text('email').toLowerCase(), phone: text('phone'),
		town: text('town'), island: text('island'), postalCode: text('postalCode'),
		organization: text('organization'), profession: text('profession'), farmSize: text('farmSize'),
		experience: text('experience'), vehicle: text('vehicle'), emailOptIn: data.get('emailOptIn') === 'yes', termsVersion: conference.termsVersion, leadPayloadVersion: 2,
	} };
}
