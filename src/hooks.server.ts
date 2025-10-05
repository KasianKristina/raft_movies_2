import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/server/prisma';
import { isWithinExpiration } from '$lib/utils/auth';

const authHandle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	if (sessionToken) {
		try {
			const session = await prisma.authSession.findUnique({
				where: { token: sessionToken },
				include: { user: true },
			});

			if (session && isWithinExpiration(session.expiresAt)) {
				event.locals.user = session.user;
				event.locals.session = session;
			} else {
				if (session) {
					await prisma.authSession.deleteMany({ where: { token: sessionToken } });
				}
				event.cookies.delete('session', { path: '/' });
				event.locals.user = null;
				event.locals.session = null;
			}
		} catch (error) {
			console.error('Session validation error:', error);
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
			event.locals.session = null;
		}
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	return await resolve(event);
};

const protectionHandle: Handle = async ({ event, resolve }) => {
	const protectedRoutes = ['/movie', '/movies', '/suggestion', '/suggestions', '/'];
	const authRoutes = ['/login', '/registration'];
	const currentPath = event.url.pathname;

	if (authRoutes.some((route) => currentPath.startsWith(route))) {
		return resolve(event);
	}

	if (!event.locals.user && protectedRoutes.some((route) => currentPath.startsWith(route))) {
		throw redirect(302, `/login?redirectTo=${currentPath}`);
	}

	return resolve(event);
};

export const handle = sequence(authHandle, protectionHandle);
