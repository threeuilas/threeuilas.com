class ProductCarousel {
	container: HTMLElement;
	slides: HTMLElement[];
	dots: HTMLElement[];
	prevButton: HTMLButtonElement | null;
	nextButton: HTMLButtonElement | null;
	currentIndex: number;
	
	constructor(container: HTMLElement) {
		this.container = container;
		this.slides = Array.from(container.querySelectorAll('.carousel-slide')) as HTMLElement[];
		this.dots = Array.from(container.querySelectorAll('.carousel-dot')) as HTMLElement[];
		this.prevButton = container.querySelector('.carousel-prev') as HTMLButtonElement | null;
		this.nextButton = container.querySelector('.carousel-next') as HTMLButtonElement | null;
		this.currentIndex = 0;
		
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
