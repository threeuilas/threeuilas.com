import { readdir, stat, rename, mkdir } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { existsSync } from 'fs';

const PUBLIC_DIR = './public';
const ORIGINALS_DIR = './public/originals';

async function moveBackupFiles(dir, baseDir = PUBLIC_DIR) {
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			// Skip the originals directory itself
			if (fullPath !== ORIGINALS_DIR) {
				await moveBackupFiles(fullPath, baseDir);
			}
		} else if (entry.name.endsWith('.backup')) {
			// Get relative path from public directory
			const relativePath = relative(baseDir, fullPath);
			// Remove .backup extension and create destination path
			const originalName = entry.name.replace('.backup', '');
			const destPath = join(ORIGINALS_DIR, relativePath.replace('.backup', ''));

			try {
				// Create destination directory if it doesn't exist
				const destDir = dirname(destPath);
				if (!existsSync(destDir)) {
					await mkdir(destDir, { recursive: true });
				}

				// Move the backup file (remove .backup extension)
				await rename(fullPath, destPath);
				console.log(`✓ Moved ${fullPath} → ${destPath}`);
			} catch (error) {
				console.error(`✗ Error moving ${fullPath}:`, error.message);
			}
		}
	}
}

async function main() {
	console.log('Moving original images to separate directory...\n');

	// Create originals directory if it doesn't exist
	if (!existsSync(ORIGINALS_DIR)) {
		await mkdir(ORIGINALS_DIR, { recursive: true });
		console.log(`Created directory: ${ORIGINALS_DIR}\n`);
	}

	const pelicanDir = join(PUBLIC_DIR, 'pelican');
	const sparrowDir = join(PUBLIC_DIR, 'sparrow');

	if (existsSync(pelicanDir)) {
		console.log('Moving Pelican originals...');
		await moveBackupFiles(pelicanDir);
	}

	if (existsSync(sparrowDir)) {
		console.log('\nMoving Sparrow originals...');
		await moveBackupFiles(sparrowDir);
	}

	console.log('\n✓ All original images moved to:', ORIGINALS_DIR);
	console.log('Folder structure has been preserved.');
}

main().catch(console.error);

