import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { SessionService } from '$lib/services/sessionService';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionToken = cookies.get('session');

		if (sessionToken) {
			try {
				await SessionService.deleteSessionByToken(sessionToken);
			} catch (error) {
				console.error('Error deleting session from database:', error);
			}
		}

		cookies.set('session', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: import.meta.env.PROD,
			maxAge: 0,
		});

		throw redirect(302, '/login');
	},
};
