# Image Optimization Guide

This project includes tools and optimizations to reduce image file sizes without compromising quality.

## What's Been Implemented

### 1. **Lazy Loading**
- Images now use `loading="lazy"` to defer loading until they're needed
- First image in carousels uses `loading="eager"` for faster initial render
- Reduces initial page load time

### 2. **Image Attributes**
- Added `decoding="async"` for better performance
- Added `fetchpriority` hints for above-the-fold images
- Helps browsers prioritize critical images

### 3. **Optimization Scripts**

Two scripts are available for compressing images:

#### Option A: Safe Mode (Recommended)
Creates optimized copies without modifying originals:
```bash
node scripts/optimize-images-safe.js
```
- Creates optimized images in `public-optimized/` directory
- Preserves original images
- Review optimized images before replacing originals

#### Option B: Direct Optimization
Optimizes images in place with backups:
```bash
pnpm run optimize-images
```
- Automatically backs up originals to `public/originals/` directory
- Optimizes images directly in `public/` directory
- Preserves folder structure in originals directory
- **Note**: Original images are safely stored in `public/originals/`

#### Moving Existing Backups
If you have `.backup` files from previous runs, move them to the originals directory:
```bash
pnpm run move-originals
```
- Moves all `.backup` files to `public/originals/`
- Removes `.backup` extension
- Preserves folder structure

## Optimization Settings

The scripts use these settings:
- **Quality**: 85% (good balance between quality and file size)
- **Max Dimensions**: 1920x1920px (images larger than this are resized)
- **Format**: JPEG with mozjpeg optimization

## Manual Optimization Tools

If you prefer manual optimization, here are some excellent tools:

1. **TinyPNG** (https://tinypng.com/)
   - Free, web-based
   - Supports PNG and JPEG
   - Drag and drop interface

2. **Squoosh** (https://squoosh.app/)
   - Google's image optimization tool
   - Compare before/after
   - Adjustable quality settings

3. **ImageOptim** (Mac)
   - Desktop app
   - Batch processing
   - Removes metadata

## Recommended Workflow

1. **Before adding new images:**
   - Resize images to maximum display size (e.g., 1920px width)
   - Use JPEG for photos, PNG for graphics/logos
   - Remove EXIF data if not needed

2. **After adding images:**
   - Run optimization script: `pnpm run optimize-images`
   - Original images are automatically backed up to `public/originals/`
   - Optimized images replace the originals in `public/`

3. **Before deploying:**
   - Check image file sizes (aim for < 500KB per image)
   - Test page load times
   - Verify image quality on different devices
   - Original images are safely stored in `public/originals/` if you need them later

## Expected Results

After optimization, you should see:
- **30-70% file size reduction** (depending on original quality)
- **Faster page load times**
- **Reduced bandwidth usage**
- **Minimal visible quality loss**

## Tips

- **Product images**: Use 85-90% quality for best balance
- **Hero images**: Can use slightly lower quality (80-85%) since they're often viewed quickly
- **Thumbnails**: Use 70-75% quality for small preview images
- **Always test**: Check optimized images on actual devices before deploying

