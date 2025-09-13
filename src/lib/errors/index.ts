import { ERROR_MESSAGES } from '$lib/constants/error-messages';
import type { AuthError, ValidationError } from './errors';

export const isAuthError = (error: unknown): error is AuthError => {
	return error instanceof Error && error.name === 'AuthError';
};

export const isValidationError = (error: unknown): error is ValidationError => {
	return error instanceof Error && error.name === 'ValidationError';
};

export const createErrorResponse = (error: unknown) => {
	if (isAuthError(error)) {
		return { success: false, code: error.code, message: error.message };
	}

	if (isValidationError(error)) {
		return {
			success: false,
			code: error.code,
			message: error.message,
			field: error.field,
		};
	}

	console.error('Unhandled error:', error);

	return {
		success: false,
		code: 'SERVER_ERROR' as const,
		message: ERROR_MESSAGES.COMMON.SERVER_ERROR,
	};
};
