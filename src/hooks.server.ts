import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { validateSession } from '$lib/server/services/sessionService';

const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	const { user, session } = await validateSession(token);

	event.locals.user = user;
	event.locals.session = session;

	return await resolve(event);
};

const protectedRoutes = ['/movie', '/movies', '/suggestion', '/suggestions', '/'];
const publicRoutes = ['/login', '/registration'];

const protectHandle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (publicRoutes.some((r) => path.startsWith(r))) {
		return await resolve(event);
	}

	if (!event.locals.user && protectedRoutes.some((r) => path.startsWith(r))) {
		throw redirect(302, `/login?redirectTo=${path}`);
	}

	return await resolve(event);
};

export const handle = sequence(authHandle, protectHandle);
