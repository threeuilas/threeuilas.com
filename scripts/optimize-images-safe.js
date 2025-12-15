import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

const PUBLIC_DIR = './public';
const OUTPUT_DIR = './public-optimized';
const QUALITY = 85; // JPEG quality (1-100, higher = better quality but larger file)
const MAX_WIDTH = 1920; // Maximum width for images
const MAX_HEIGHT = 1920; // Maximum height for images

async function optimizeImage(inputPath, outputPath) {
	try {
		const stats = await stat(inputPath);
		const originalSize = stats.size;

		// Ensure output directory exists
		const outputDir = dirname(outputPath);
		if (!existsSync(outputDir)) {
			await mkdir(outputDir, { recursive: true });
		}

		await sharp(inputPath)
			.resize(MAX_WIDTH, MAX_HEIGHT, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.jpeg({ quality: QUALITY, mozjpeg: true })
			.toFile(outputPath);

		const newStats = await stat(outputPath);
		const newSize = newStats.size;
		const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

		console.log(`✓ ${inputPath}`);
		console.log(`  ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% reduction)`);

		return { originalSize, newSize, savings };
	} catch (error) {
		console.error(`✗ Error optimizing ${inputPath}:`, error.message);
		return null;
	}
}

async function processDirectory(dir, outputBaseDir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const imageExtensions = ['.jpg', '.jpeg', '.png'];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		const relativePath = fullPath.replace(PUBLIC_DIR + '/', '');
		const outputPath = join(outputBaseDir, relativePath);

		if (entry.isDirectory()) {
			await processDirectory(fullPath, outputBaseDir);
		} else if (imageExtensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
			await optimizeImage(fullPath, outputPath);
		}
	}
}

async function main() {
	console.log('Starting image optimization (safe mode - creates optimized copies)...\n');
	console.log(`Output directory: ${OUTPUT_DIR}\n`);
	
	const pelicanDir = join(PUBLIC_DIR, 'pelican');
	const sparrowDir = join(PUBLIC_DIR, 'sparrow');

	if (existsSync(pelicanDir)) {
		console.log('Optimizing Pelican images...');
		await processDirectory(pelicanDir, OUTPUT_DIR);
	}

	if (existsSync(sparrowDir)) {
		console.log('\nOptimizing Sparrow images...');
		await processDirectory(sparrowDir, OUTPUT_DIR);
	}

	console.log('\n✓ Image optimization complete!');
	console.log(`Optimized images are in: ${OUTPUT_DIR}`);
	console.log('Review the optimized images, then replace the originals if satisfied.');
}

main().catch(console.error);

