import sharp from 'sharp';
import { readdir, stat, rename, mkdir } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { existsSync } from 'fs';

const PUBLIC_DIR = './public';
const ORIGINALS_DIR = './public/originals';
const QUALITY = 85; // JPEG quality (1-100, higher = better quality but larger file)
const MAX_WIDTH = 1920; // Maximum width for images
const MAX_HEIGHT = 1920; // Maximum height for images

async function optimizeImage(inputPath, tempPath) {
	try {
		const stats = await stat(inputPath);
		const originalSize = stats.size;

		await sharp(inputPath)
			.resize(MAX_WIDTH, MAX_HEIGHT, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.jpeg({ quality: QUALITY, mozjpeg: true })
			.toFile(tempPath);

		const newStats = await stat(tempPath);
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

async function processDirectory(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const imageExtensions = ['.jpg', '.jpeg', '.png'];
	const fs = await import('fs/promises');

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await processDirectory(fullPath);
		} else if (imageExtensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
			// Create backup in originals directory if it doesn't exist
			const relativePath = relative(PUBLIC_DIR, fullPath);
			const backupPath = join(ORIGINALS_DIR, relativePath);
			
			if (!existsSync(backupPath)) {
				// Create originals directory structure if needed
				const backupDir = dirname(backupPath);
				if (!existsSync(backupDir)) {
					await mkdir(backupDir, { recursive: true });
				}
				await fs.copyFile(fullPath, backupPath);
			}

			// Create temporary file for optimized version
			const tempPath = fullPath + '.tmp';
			
			// Optimize to temporary file
			await optimizeImage(fullPath, tempPath);
			
			// Replace original with optimized version
			await rename(tempPath, fullPath);
		}
	}
}

async function main() {
	console.log('Starting image optimization...\n');
	
	// Create originals directory if it doesn't exist
	if (!existsSync(ORIGINALS_DIR)) {
		await mkdir(ORIGINALS_DIR, { recursive: true });
	}
	
	const pelicanDir = join(PUBLIC_DIR, 'pelican');
	const sparrowDir = join(PUBLIC_DIR, 'sparrow');

	if (existsSync(pelicanDir)) {
		console.log('Optimizing Pelican images...');
		await processDirectory(pelicanDir);
	}

	if (existsSync(sparrowDir)) {
		console.log('\nOptimizing Sparrow images...');
		await processDirectory(sparrowDir);
	}

	console.log('\n✓ Image optimization complete!');
	console.log(`Original images have been backed up to: ${ORIGINALS_DIR}`);
}

main().catch(console.error);

