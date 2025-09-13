import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandle: Handle = async ({ event, resolve }) => {
	try {
		const sessionId = event.cookies.get(lucia.sessionCookieName);
		if (!sessionId) {
			event.locals.user = null;
			event.locals.session = null;
			return resolve(event);
		}

		const { session, user } = await lucia.validateSession(sessionId);
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		}

		event.locals.user = user;
		event.locals.session = session;

		return resolve(event);
	} catch (error) {
		console.error('Auth hook error:', error);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
		event.locals.user = null;
		event.locals.session = null;

		return resolve(event);
	}
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
