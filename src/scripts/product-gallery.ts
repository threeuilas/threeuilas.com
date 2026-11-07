import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

document.querySelectorAll<HTMLElement>('[data-product-gallery]').forEach(gallery => {
	const links = Array.from(gallery.querySelectorAll<HTMLAnchorElement>('a[data-product-photo]'));
	// A photo may appear in the overview, features, and gallery. Show it once in the viewer.
	const uniqueLinks = Array.from(new Map(links.map(link => [link.href, link])).values());
	const photos = uniqueLinks.map(link => ({
		src: link.href,
		width: Number(link.dataset.pswpWidth),
		height: Number(link.dataset.pswpHeight),
		alt: link.querySelector('img')?.alt ?? '',
	}));
	const lightbox = new PhotoSwipeLightbox({
		dataSource: photos,
		bgOpacity: 0.96,
		// Some thumbnails are hidden in feature tabs or have different crops.
		showHideAnimationType: 'fade',
		pswpModule: () => import('photoswipe'),
	});
	lightbox.init();

	gallery.addEventListener('click', event => {
		if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-product-photo]') : null;
		if (!link || !gallery.contains(link)) return;
		const index = photos.findIndex(photo => photo.src === link.href);
		if (index < 0) return;
		// Restore keyboard focus to the actual thumbnail, including repeated photos.
		link.focus({ preventScroll: true });
		if (lightbox.loadAndOpen(index)) event.preventDefault();
	});
});
