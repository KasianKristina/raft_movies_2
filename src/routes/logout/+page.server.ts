import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { prisma } from '$lib/server/prisma';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			throw redirect(302, '/login');
		}

		const sessionToken = cookies.get('session');

		if (sessionToken) {
			await prisma.authSession.deleteMany({
				where: {
					token: sessionToken,
				},
			});
		}

		cookies.set('session', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 0,
		});

		throw redirect(302, '/login');
	},
};
