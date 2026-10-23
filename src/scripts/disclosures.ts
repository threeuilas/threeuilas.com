type DisclosureState = {
	summary: HTMLElement;
	content: HTMLElement;
	expanded: boolean;
	animation: Animation | null;
};

const states = new WeakMap<HTMLDetailsElement, DisclosureState>();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initializeDisclosure(details: HTMLDetailsElement) {
	const existing = states.get(details);
	if (existing) return existing;
	const summary = details.querySelector<HTMLElement>(':scope > summary');
	const content = details.querySelector<HTMLElement>(':scope > [data-disclosure-content]');
	if (!summary || !content) return;

	const state: DisclosureState = { summary, content, expanded: details.open, animation: null };
	states.set(details, state);
	details.dataset.disclosureReady = '';
	details.dataset.expanded = String(details.open);
	summary.setAttribute('aria-expanded', String(details.open));
	content.inert = !details.open;

	summary.addEventListener('click', event => {
		event.preventDefault();
		setDisclosureOpen(details, !state.expanded);
	});
	// Keep native or external changes to `open` in sync with the indicator.
	details.addEventListener('toggle', () => {
		if (state.animation || details.open === state.expanded) return;
		state.expanded = details.open;
		details.dataset.expanded = String(details.open);
		summary.setAttribute('aria-expanded', String(details.open));
		content.inert = !details.open;
	});
	return state;
}

export function setDisclosureOpen(details: HTMLDetailsElement, expanded: boolean, { animate = true } = {}) {
	const state = initializeDisclosure(details);
	if (!state) {
		details.open = expanded;
		return;
	}
	if (state.expanded === expanded && !state.animation) return;

	const { content, summary } = state;
	const startHeight = details.open ? content.getBoundingClientRect().height : 0;
	const startOpacity = details.open ? getComputedStyle(content).opacity : '0';
	state.animation?.cancel();
	state.animation = null;
	state.expanded = expanded;
	details.dataset.expanded = String(expanded);
	summary.setAttribute('aria-expanded', String(expanded));
	content.inert = !expanded;
	if (!expanded && content.contains(document.activeElement)) summary.focus();

	if (!animate || reducedMotion.matches) {
		details.open = expanded;
		return;
	}

	// Keep the native disclosure open until its closing animation has finished.
	details.open = true;
	const endHeight = expanded ? content.getBoundingClientRect().height : 0;
	const animation = content.animate([
		{ height: `${startHeight}px`, opacity: startOpacity, overflow: 'clip' },
		{ height: `${endHeight}px`, opacity: expanded ? '1' : '0', overflow: 'clip' },
	], { duration: expanded ? 340 : 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
	state.animation = animation;
	animation.onfinish = () => {
		if (state.animation !== animation) return;
		state.animation = null;
		details.open = expanded;
		animation.cancel();
	};
}

export function initializeDisclosures() {
	document.querySelectorAll<HTMLDetailsElement>('details[data-disclosure]').forEach(initializeDisclosure);
}

reducedMotion.addEventListener('change', () => {
	if (!reducedMotion.matches) return;
	document.querySelectorAll<HTMLDetailsElement>('details[data-disclosure]').forEach(details => {
		const state = states.get(details);
		if (state?.animation) setDisclosureOpen(details, state.expanded, { animate: false });
	});
});
