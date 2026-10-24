# Product image preparation

Large camera photos should be converted into responsive web assets before use. The current product pages serve WebP files selected for the visitor’s screen width, while preserving the source images separately.

## Current assets

| Model | Web assets | Component | Alt text and captions |
| --- | --- | --- | --- |
| Workhorse Pro | `public/workhorse-pro/` | [WorkhorsePhoto.astro](src/components/WorkhorsePhoto.astro) | [workhorse-pro.ts](src/data/workhorse-pro.ts) |
| Sparrow+ | `public/sparrow-plus/` | [SparrowPhoto.astro](src/components/SparrowPhoto.astro) | [sparrow-plus.ts](src/data/sparrow-plus.ts) |

Each selected photo has 640, 1280, and 1920-pixel-wide versions, named `<photo>-<width>.webp`. Components provide `srcset`, layout-specific `sizes`, explicit dimensions, and asynchronous decoding. Hero photos load eagerly with high fetch priority; other photos load lazily. Product galleries open the 1920-pixel version in PhotoSwipe and retain direct image links without JavaScript.

The Workhorse Pro set contains 17 selected photos. Most are 3:2 landscape images; the action portraits, hydraulic-cylinder photo, panel-latch photo, and headlight photo are 2:3 portraits. `workhorsePhotos` records portrait orientation. The five Sparrow+ photos are 4:3 landscapes. Update component dimensions and PhotoSwipe width/height metadata if replacement images use different proportions.

## Preparing replacement photos

1. Review the source photo and choose its role: hero, feature explanation, or gallery detail. Use an image that shows the feature being described.
2. Preserve the source outside the served asset folder. The Workhorse Pro camera originals remain in the untracked `10:22 Workhorse Pro Selected/` folder. Existing Sparrow source photos are under `public/originals/sparrow/`.
3. Use the installed `sharp` package to apply EXIF orientation, preserve proportions, and create 640, 1280, and 1920-pixel-wide WebP files. The current sets were prepared at quality 80 for the smaller sizes and 84 for 1920px, with effort 5. These are starting settings; inspect the results at the intended display size.
4. Follow the existing filename pattern or update the photo component, model data, gallery links, and social-preview image together. Replacing the existing Sparrow+ asset names keeps the page structure intact when new photography arrives.
5. Review alt text and visible captions against both the photo and current product copy. Describe the image accurately; do not add a load, demonstration, or performance result that is absent from the photo.
6. Check phone and desktop crops, hero priority, lazy loading, and the full-screen viewer. Verify actual file sizes; detailed foliage can make larger WebP variants exceed 500 KB.

The site uses the existing Sparrow photos as Sparrow+ photos because the user confirmed that both models share the same appearance. Do not restore an “original Sparrow shown” disclaimer. Future Sparrow+ photography can replace these assets without changing that policy.

## Reproducible conversion example

Replace the source path and output stem with the selected photo. This writes new WebP files and leaves the source unchanged.

```js
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourcePath = '/path/to/selected-photo.jpeg';
const outputDirectory = 'public/workhorse-pro';
const outputStem = 'selected-photo';

await mkdir(outputDirectory, { recursive: true });
for (const width of [640, 1280, 1920]) {
  await sharp(sourcePath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: width === 1920 ? 84 : 80, effort: 5 })
    .toFile(`${outputDirectory}/${outputStem}-${width}.webp`);
}
```

Run as an ES module from this repository so the installed `sharp` dependency resolves. Use sources at least 1920 pixels wide for the current filename and `srcset` conventions; do not label a smaller output as a larger width.

## Legacy image tooling

These scripts serve the earlier image layout and do not generate the current Workhorse Pro or Sparrow+ responsive sets.

| Command | Actual scope |
| --- | --- |
| `pnpm generate-gallery-images` | Reads JPEGs from `public/workhorse/` and `public/sparrow/`; generates 1024px WebP previews in `public/gallery/` at quality 72. |
| `pnpm optimize-images` | Processes legacy `public/pelican/` and `public/sparrow/` directories if present. Backs up source files under `public/originals/`, then replaces files with JPEG output bounded by 1920×1920 at quality 85. It also accepts PNG input, so review its scope before use with transparent assets. |
| `pnpm move-originals` | Moves `.backup` files from the legacy Pelican and Sparrow folders into `public/originals/`. |

There is no `scripts/optimize-images-safe.js` in the repository. The legacy optimizer is not the preparation workflow for new responsive product assets.

## Git and source ownership

The current WebP assets are committed. The temporary Workhorse Pro camera folder and unused compact print logo were intentionally excluded from the redesign commit and remain local. Builds use the permanent assets, so removing access to the temporary source folder does not break the site.

Some older gallery paths use Git LFS, as configured in [.gitattributes](.gitattributes). The new `public/workhorse-pro/` and `public/sparrow-plus/` paths are ordinary tracked binary assets.
