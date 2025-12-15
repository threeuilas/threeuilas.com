class ProductCarousel {
	container: HTMLElement;
	slides: HTMLElement[];
	dots: HTMLElement[];
	prevButton: HTMLButtonElement | null;
	nextButton: HTMLButtonElement | null;
	currentIndex: number;
	images: string[];
	alt: string;
	
	// Image viewer elements
	modal: HTMLElement | null;
	modalImage: HTMLImageElement | null;
	modalPrevButton: HTMLButtonElement | null;
	modalNextButton: HTMLButtonElement | null;
	modalCloseButton: HTMLButtonElement | null;
	modalCurrentSpan: HTMLElement | null;
	viewerCurrentIndex: number;
	
	constructor(container: HTMLElement) {
		this.container = container;
		this.slides = Array.from(container.querySelectorAll('.carousel-slide')) as HTMLElement[];
		this.dots = Array.from(container.querySelectorAll('.carousel-dot')) as HTMLElement[];
		this.prevButton = container.querySelector('.carousel-prev') as HTMLButtonElement | null;
		this.nextButton = container.querySelector('.carousel-next') as HTMLButtonElement | null;
		this.currentIndex = 0;
		
		// Get images array from data attribute
		const imagesData = container.getAttribute('data-images');
		this.images = imagesData ? JSON.parse(imagesData) : [];
		this.alt = container.getAttribute('data-alt') || '';
		
		// Image viewer elements - modal is a sibling of the carousel container within the wrapper
		const carouselWrapper = container.closest('.product-carousel-wrapper');
		this.modal = carouselWrapper?.querySelector('.image-viewer-modal') as HTMLElement | null;
		this.modalImage = this.modal?.querySelector('.image-viewer-image') as HTMLImageElement | null;
		this.modalPrevButton = this.modal?.querySelector('.image-viewer-prev') as HTMLButtonElement | null;
		this.modalNextButton = this.modal?.querySelector('.image-viewer-next') as HTMLButtonElement | null;
		this.modalCloseButton = this.modal?.querySelector('.image-viewer-close') as HTMLButtonElement | null;
		this.modalCurrentSpan = this.modal?.querySelector('.image-viewer-current') as HTMLElement | null;
		this.viewerCurrentIndex = 0;
		
		// Check if already initialized
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
		
		// Add click handlers to images
		this.slides.forEach((slide: HTMLElement, index: number) => {
			const img = slide.querySelector('img');
			if (img) {
				img.addEventListener('click', () => this.openImageViewer(index));
			}
		});
		
		// Initialize image viewer
		if (this.modal) {
			this.initImageViewer();
		}
	}
	
	initImageViewer(): void {
		if (!this.modal) return;
		
		// Close button
		if (this.modalCloseButton) {
			this.modalCloseButton.addEventListener('click', () => this.closeImageViewer());
		}
		
		// Navigation buttons
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
		
		// Click outside to close
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.closeImageViewer();
			}
		});
		
		// Keyboard navigation
		document.addEventListener('keydown', (e) => {
			if (!this.modal?.classList.contains('hidden')) {
				if (e.key === 'Escape') {
					this.closeImageViewer();
				} else if (e.key === 'ArrowLeft') {
					this.viewerPrev();
				} else if (e.key === 'ArrowRight') {
					this.viewerNext();
				}
			}
		});
	}
	
	openImageViewer(index: number): void {
		if (!this.modal || !this.modalImage) return;
		
		this.viewerCurrentIndex = index;
		this.updateViewerImage();
		this.modal.classList.remove('hidden');
		this.modal.classList.add('flex');
		document.body.style.overflow = 'hidden'; // Prevent background scrolling
	}
	
	closeImageViewer(): void {
		if (!this.modal) return;
		
		this.modal.classList.add('hidden');
		this.modal.classList.remove('flex');
		document.body.style.overflow = ''; // Restore scrolling
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
		if (!this.modalImage || !this.modalCurrentSpan) return;
		
		// Validate index is within bounds
		if (this.viewerCurrentIndex < 0 || this.viewerCurrentIndex >= this.images.length) {
			return;
		}
		
		const imageUrl = this.images[this.viewerCurrentIndex];
		if (!imageUrl) return;
		
		// Update counter immediately for better UX
		this.modalCurrentSpan.textContent = String(this.viewerCurrentIndex + 1);
		
		// Always clear src first, then set it to force browser to attempt loading
		// This is critical when images fail to load - ensures each navigation
		// triggers a fresh load attempt rather than showing cached broken state
		this.modalImage.src = '';
		
		// Use requestAnimationFrame to ensure browser processes the src clearing
		// before we set the new src
		requestAnimationFrame(() => {
			if (this.modalImage && 
			    this.viewerCurrentIndex >= 0 && 
			    this.viewerCurrentIndex < this.images.length &&
			    this.images[this.viewerCurrentIndex] === imageUrl) {
				this.modalImage!.src = imageUrl;
				this.modalImage!.alt = `${this.alt} - Image ${this.viewerCurrentIndex + 1}`;
			}
		});
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

// Initialize all carousels on the page
function initCarousels(): void {
	const carousels = document.querySelectorAll('.product-carousel:not([data-carousel-initialized])');
	carousels.forEach((carousel) => {
		carousel.setAttribute('data-carousel-initialized', 'true');
		new ProductCarousel(carousel as HTMLElement);
	});
}

// Prevent multiple initializations
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
