class ProductCarousel {
	container: HTMLElement;
	slides: HTMLElement[];
	dots: HTMLElement[];
	prevButton: HTMLButtonElement | null;
	nextButton: HTMLButtonElement | null;
	currentIndex: number;
	images: string[];
	alt: string;
	autoAdvanceInterval: ReturnType<typeof setInterval> | null;

	// Image viewer elements
	modal: HTMLElement | null;
	modalImage: HTMLImageElement | null;
	modalPrevButton: HTMLButtonElement | null;
	modalNextButton: HTMLButtonElement | null;
	modalCloseButton: HTMLButtonElement | null;
	thumbnails: HTMLElement[];
	viewerCurrentIndex: number;

	constructor(container: HTMLElement) {
		this.container = container;
		this.slides = Array.from(container.querySelectorAll('.carousel-slide')) as HTMLElement[];
		this.dots = Array.from(container.querySelectorAll('.carousel-dot')) as HTMLElement[];
		this.prevButton = container.querySelector('.carousel-prev') as HTMLButtonElement | null;
		this.nextButton = container.querySelector('.carousel-next') as HTMLButtonElement | null;
		this.currentIndex = 0;
		this.autoAdvanceInterval = null;

		const imagesData = container.getAttribute('data-images');
		this.images = imagesData ? JSON.parse(imagesData) : [];
		this.alt = container.getAttribute('data-alt') || '';

		const carouselWrapper = container.closest('.product-carousel-wrapper');
		this.modal = carouselWrapper?.querySelector('.image-viewer-modal') as HTMLElement | null;
		this.modalImage = this.modal?.querySelector('.image-viewer-image') as HTMLImageElement | null;
		this.modalPrevButton = this.modal?.querySelector('.image-viewer-prev') as HTMLButtonElement | null;
		this.modalNextButton = this.modal?.querySelector('.image-viewer-next') as HTMLButtonElement | null;
		this.modalCloseButton = this.modal?.querySelector('.image-viewer-close') as HTMLButtonElement | null;
		this.thumbnails = Array.from(this.modal?.querySelectorAll('.image-viewer-thumb') ?? []) as HTMLElement[];
		this.viewerCurrentIndex = 0;

		if ((container as any).__carouselInitialized) {
			return;
		}
		(container as any).__carouselInitialized = true;

		this.init();
	}

	init(): void {
		if (this.prevButton) {
			this.prevButton.addEventListener('click', () => this.prev());
		}
		if (this.nextButton) {
			this.nextButton.addEventListener('click', () => this.next());
		}

		this.dots.forEach((dot: HTMLElement, index: number) => {
			dot.addEventListener('click', () => this.goToSlide(index));
		});

		// Click to open viewer — always use currentIndex since slides are stacked via
		// absolute positioning and any slide may capture the event
		this.slides.forEach((slide: HTMLElement) => {
			const img = slide.querySelector('img');
			if (img) {
				img.addEventListener('click', () => this.openImageViewer(this.currentIndex));
			}
		});

		// Touch swipe
		let touchStartX = 0;
		let touchStartY = 0;
		this.container.addEventListener('touchstart', (e) => {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}, { passive: true });
		this.container.addEventListener('touchend', (e) => {
			const deltaX = e.changedTouches[0].clientX - touchStartX;
			const deltaY = e.changedTouches[0].clientY - touchStartY;
			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
				if (deltaX < 0) this.next();
				else this.prev();
			}
		}, { passive: true });

		// Auto-advance
		const interval = parseInt(this.container.getAttribute('data-auto-advance') || '0');
		if (interval > 0) {
			this.startAutoAdvance(interval);
			this.container.addEventListener('mouseenter', () => this.stopAutoAdvance());
			this.container.addEventListener('mouseleave', () => this.startAutoAdvance(interval));
		}

		if (this.modal) {
			this.initImageViewer();
		}
	}

	startAutoAdvance(interval: number): void {
		this.stopAutoAdvance();
		this.autoAdvanceInterval = setInterval(() => this.next(), interval);
	}

	stopAutoAdvance(): void {
		if (this.autoAdvanceInterval) {
			clearInterval(this.autoAdvanceInterval);
			this.autoAdvanceInterval = null;
		}
	}

	initImageViewer(): void {
		if (!this.modal) return;

		if (this.modalCloseButton) {
			this.modalCloseButton.addEventListener('click', () => this.closeImageViewer());
		}

		if (this.modalPrevButton) {
			this.modalPrevButton.addEventListener('click', (e) => {
				e.stopPropagation();
				this.viewerPrev();
			});
		}

		if (this.modalNextButton) {
			this.modalNextButton.addEventListener('click', (e) => {
				e.stopPropagation();
				this.viewerNext();
			});
		}

		// Thumbnail clicks
		this.thumbnails.forEach((thumb, index) => {
			thumb.addEventListener('click', (e) => {
				e.stopPropagation();
				this.viewerCurrentIndex = index;
				this.updateViewerImage();
			});
		});

		// Click backdrop to close
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.closeImageViewer();
			}
		});

		// Touch swipe inside modal
		let touchStartX = 0;
		this.modal.addEventListener('touchstart', (e) => {
			touchStartX = e.touches[0].clientX;
		}, { passive: true });
		this.modal.addEventListener('touchend', (e) => {
			const deltaX = e.changedTouches[0].clientX - touchStartX;
			if (Math.abs(deltaX) > 50) {
				if (deltaX < 0) this.viewerNext();
				else this.viewerPrev();
			}
		}, { passive: true });

		// Keyboard navigation
		document.addEventListener('keydown', (e) => {
			if (!this.modal?.classList.contains('hidden')) {
				if (e.key === 'Escape') this.closeImageViewer();
				else if (e.key === 'ArrowLeft') this.viewerPrev();
				else if (e.key === 'ArrowRight') this.viewerNext();
			}
		});
	}

	openImageViewer(index: number): void {
		if (!this.modal || !this.modalImage) return;

		this.viewerCurrentIndex = index;
		this.updateViewerImage();
		this.modal.classList.remove('hidden');
		this.modal.classList.add('flex');
		document.body.style.overflow = 'hidden';
	}

	closeImageViewer(): void {
		if (!this.modal) return;

		this.modal.classList.add('hidden');
		this.modal.classList.remove('flex');
		document.body.style.overflow = '';

		// Sync carousel to wherever the viewer was when closed
		if (this.viewerCurrentIndex !== this.currentIndex) {
			this.currentIndex = this.viewerCurrentIndex;
			this.updateSlides();
		}
	}

	viewerNext(): void {
		if (this.images.length === 0) return;
		this.viewerCurrentIndex = (this.viewerCurrentIndex + 1) % this.images.length;
		this.updateViewerImage();
	}

	viewerPrev(): void {
		if (this.images.length === 0) return;
		this.viewerCurrentIndex = (this.viewerCurrentIndex - 1 + this.images.length) % this.images.length;
		this.updateViewerImage();
	}

	updateViewerImage(): void {
		if (!this.modalImage) return;

		if (this.viewerCurrentIndex < 0 || this.viewerCurrentIndex >= this.images.length) return;

		const imageUrl = this.images[this.viewerCurrentIndex];
		if (!imageUrl) return;

		this.modalImage.src = '';

		requestAnimationFrame(() => {
			if (this.modalImage &&
				this.viewerCurrentIndex >= 0 &&
				this.viewerCurrentIndex < this.images.length &&
				this.images[this.viewerCurrentIndex] === imageUrl) {
				this.modalImage!.src = imageUrl;
				this.modalImage!.alt = `${this.alt} - Image ${this.viewerCurrentIndex + 1}`;
			}
		});

		this.updateThumbnails();
	}

	updateThumbnails(): void {
		this.thumbnails.forEach((thumb, index) => {
			if (index === this.viewerCurrentIndex) {
				thumb.classList.add('ring-2', 'ring-white', 'opacity-100');
				thumb.classList.remove('opacity-50');
			} else {
				thumb.classList.remove('ring-2', 'ring-white', 'opacity-100');
				thumb.classList.add('opacity-50');
			}
		});

		const activeThumb = this.thumbnails[this.viewerCurrentIndex];
		activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	}

	goToSlide(index: number): void {
		if (index === this.currentIndex) return;
		this.currentIndex = index;
		this.updateSlides();
	}

	next(): void {
		this.currentIndex = (this.currentIndex + 1) % this.slides.length;
		this.updateSlides();
	}

	prev(): void {
		this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
		this.updateSlides();
	}

	updateSlides(): void {
		this.slides.forEach((slide: HTMLElement, index: number) => {
			if (index === this.currentIndex) {
				slide.classList.remove('opacity-0');
				slide.classList.add('opacity-100');
			} else {
				slide.classList.remove('opacity-100');
				slide.classList.add('opacity-0');
			}
		});

		this.dots.forEach((dot: HTMLElement, index: number) => {
			if (index === this.currentIndex) {
				dot.classList.remove('bg-white/50');
				dot.classList.add('bg-white');
			} else {
				dot.classList.remove('bg-white');
				dot.classList.add('bg-white/50');
			}
		});
	}
}

function initCarousels(): void {
	const carousels = document.querySelectorAll('.product-carousel:not([data-carousel-initialized])');
	carousels.forEach((carousel) => {
		carousel.setAttribute('data-carousel-initialized', 'true');
		new ProductCarousel(carousel as HTMLElement);
	});
}

declare global {
	interface Window {
		productCarouselInitialized?: boolean;
	}
}

if (typeof window !== 'undefined') {
	if (!window.productCarouselInitialized) {
		window.productCarouselInitialized = true;

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initCarousels);
		} else {
			initCarousels();
		}
	}
}

export default ProductCarousel;
