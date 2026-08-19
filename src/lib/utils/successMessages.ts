import { SUCCESS_MESSAGES, type SuccessCode } from '$lib/constants/success-messages';

export const getSuccessMessage = (code: SuccessCode): string => {
	return SUCCESS_MESSAGES[code];
};
