import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { extname, join, parse } from 'node:path';

const publicDirectory = new URL('../public/', import.meta.url);
const outputDirectory = new URL('../public/gallery/', import.meta.url);
const productDirectories = ['workhorse', 'sparrow'];

for (const product of productDirectories) {
	const sourceDirectory = new URL(`${product}/`, publicDirectory);
	const destinationDirectory = new URL(`${product}/`, outputDirectory);
	await mkdir(destinationDirectory, { recursive: true });

	const filenames = await readdir(sourceDirectory);
	const jpegFiles = filenames.filter((filename) => ['.jpg', '.jpeg'].includes(extname(filename).toLowerCase()));

	await Promise.all(jpegFiles.map(async (filename) => {
		const outputFilename = `${parse(filename).name}.webp`;
		await sharp(join(sourceDirectory.pathname, filename))
			.resize({ width: 1024, withoutEnlargement: true })
			.webp({ quality: 72, effort: 4 })
			.toFile(join(destinationDirectory.pathname, outputFilename));
	}));

	console.log(`Generated ${jpegFiles.length} ${product} gallery images.`);
}
