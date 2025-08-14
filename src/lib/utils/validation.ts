export const isValidEmail = (email: string): boolean => {
	const atSymbolIndex = email.indexOf('@');
	if (atSymbolIndex === -1 || atSymbolIndex !== email.lastIndexOf('@')) {
		return false;
	}

	const [localPart, domain] = email.split('@');

	if (!localPart || !domain || localPart.length > 64 || domain.length > 255) {
		return false;
	}

	const localRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
	if (
		!localRegex.test(localPart) ||
		localPart.startsWith('.') ||
		localPart.endsWith('.') ||
		localPart.includes('..')
	) {
		return false;
	}

	const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
	if (
		!domainRegex.test(domain) ||
		domain.includes('--') ||
		domain.startsWith('-') ||
		domain.endsWith('-')
	) {
		return false;
	}

	return true;
};
