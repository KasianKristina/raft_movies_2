import { ERROR_MESSAGES } from '$lib/constants/error-messages';

export class AuthError extends Error {
	constructor(public code: keyof typeof ERROR_MESSAGES.AUTH) {
		super(ERROR_MESSAGES.AUTH[code]);
		this.name = 'AuthError';
	}
}

export class ValidationError extends Error {
	constructor(public code: keyof typeof ERROR_MESSAGES.VALIDATION) {
		super(ERROR_MESSAGES.VALIDATION[code]);
		this.name = 'ValidationError';
	}
}

export class AppError extends Error {
	constructor(public code: keyof typeof ERROR_MESSAGES.COMMON) {
		super(ERROR_MESSAGES.COMMON[code]);
		this.name = 'AppError';
	}
}
