const panel = document.querySelector<HTMLElement>('#entry')!;
const form = document.querySelector<HTMLFormElement>('#conference-form')!;
const steps = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
const next = document.querySelector<HTMLButtonElement>('#entry-next')!;
const back = document.querySelector<HTMLButtonElement>('#entry-back')!;
const submit = document.querySelector<HTMLButtonElement>('#entry-submit')!;
const actions = document.querySelector<HTMLElement>('#entry-submit-actions')!;
const error = document.querySelector<HTMLElement>('#entry-error')!;
let currentStep = 1;
let sending = false;

function showStep(step: number, focus = true) {
	currentStep = step;
	steps.forEach((section, index) => { section.hidden = index + 1 !== step; });
	form.querySelectorAll<HTMLElement>('[data-progress]').forEach(item => {
		if (item.dataset.progress === String(step)) item.setAttribute('aria-current', 'step');
		else item.removeAttribute('aria-current');
	});
	next.hidden = step !== 1;
	back.hidden = step !== 2;
	actions.hidden = step !== 2;
	error.hidden = true;
	if (focus) steps[step - 1].querySelector<HTMLElement>('input, select')?.focus();
}

function validateStep(step: number): boolean {
	const controls = steps[step - 1].querySelectorAll('input, select');
	for (const control of controls) {
		if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement)) continue;
		if (control.name === 'phone') {
			const count = control.value.replace(/\D/g, '').length;
			control.setCustomValidity(count >= 10 && count <= 15 && /^\+?[\d\s().-]+$/.test(control.value.trim()) ? '' : 'Enter a valid phone number, including the area code.');
		}
		if (!control.checkValidity()) {
			showStep(step, false);
			control.reportValidity();
			control.focus();
			return false;
		}
	}
	return true;
}

function checkWindow(): boolean {
	const now = Date.now();
	const opens = Date.parse(panel.dataset.opensAt!);
	const closes = Date.parse(panel.dataset.closesAt!);
	const message = document.querySelector<HTMLElement>('#entry-window-message')!;
	if (now < opens || now >= closes) {
		form.hidden = true;
		message.hidden = false;
		message.textContent = now < opens ? 'Entries are not open yet. Please check back shortly.' : 'Entries are closed. Mahalo to everyone who entered! Our team will contact the winner directly.';
		return false;
	}
	return true;
}

form.querySelector<HTMLElement>('.form-progress')!.hidden = false;
submit.disabled = false;
showStep(1, false);
checkWindow();
next.addEventListener('click', () => { if (validateStep(1)) showStep(2); });
back.addEventListener('click', () => { if (!sending) showStep(1); });
form.addEventListener('input', event => {
	if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('');
});

form.addEventListener('submit', async event => {
	event.preventDefault();
	if (sending || !checkWindow()) return;
	if (currentStep === 1) { if (validateStep(1)) showStep(2); return; }
	if (!validateStep(1) || !validateStep(2)) return;
	sending = true;
	submit.disabled = true;
	back.disabled = true;
	submit.setAttribute('aria-busy', 'true');
	submit.textContent = 'Saving your entry…';
	error.hidden = true;
	try {
		const response = await fetch('/api/conference', { method: 'POST', body: new FormData(form) });
		const result = await response.json() as { success?: boolean; error?: string; field?: string };
		if (!response.ok || !result.success) {
			if (result.field) {
				const control = form.elements.namedItem(result.field);
				if (control instanceof HTMLElement) {
					const step = control.closest<HTMLFieldSetElement>('[data-step]')?.dataset.step;
					if (step) showStep(Number(step), false);
				}
			}
			throw new Error(result.error || 'We could not save your entry. Please try again.');
		}
		document.querySelector<HTMLElement>('#entry-content')!.hidden = true;
		const success = document.querySelector<HTMLElement>('#entry-success')!;
		success.hidden = false;
		success.focus();
	} catch (cause) {
		error.textContent = cause instanceof Error ? cause.message : 'Connection interrupted. Your details are still here; please try again.';
		error.hidden = false;
		error.focus();
		// Tokens are single-use, including attempts that fail after verification.
		form.querySelector<HTMLElement>('[data-turnstile-widget]')?.dispatchEvent(new Event('turnstile:reset'));
	} finally {
		sending = false;
		submit.disabled = false;
		back.disabled = false;
		submit.removeAttribute('aria-busy');
		submit.textContent = 'Enter to win 15% off';
	}
});
