import { SUCCESS_MESSAGES, type SuccessCode } from '$lib/constants/success-messages';

export function getSuccessMessage(code: SuccessCode): string {
	return SUCCESS_MESSAGES[code];
}
