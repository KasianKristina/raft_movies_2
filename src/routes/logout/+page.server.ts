import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { clearSessionCookie, invalidateSession } from '$lib/server/services/sessionService';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await invalidateSession(token);
		}

		clearSessionCookie(cookies);
		throw redirect(302, '/login');
	},
};
