import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { deleteSessionByToken, clearSessionCookie } from '$lib/server/services/sessionService';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await deleteSessionByToken(token);
		}

		clearSessionCookie(cookies);
		throw redirect(302, '/login');
	},
};
