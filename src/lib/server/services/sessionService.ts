import { prisma } from '$lib/server/db/prisma';
import { generateId, isWithinExpiration } from '$lib/server/utils/auth';
import type { Cookies } from '@sveltejs/kit';

const SESSION_TOKEN_NAME = 'session';
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

export interface SessionData {
	token: string;
	userId: string;
	expiresAt: Date;
}

export async function createSession(userId: string, cookies: Cookies): Promise<string> {
	const token = generateId(40);
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

	await prisma.authSession.create({
		data: {
			token,
			userId,
			expiresAt,
		},
	});

	cookies.set(SESSION_TOKEN_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: SESSION_MAX_AGE / 1000,
	});

	return token;
}

export async function validateSession(
	token: string | undefined,
): Promise<{ user: any | null; session: any | null }> {
	if (!token) {
		return { user: null, session: null };
	}

	const session = await prisma.authSession.findUnique({
		where: { token },
		include: { user: true },
	});

	if (!session) {
		return { user: null, session: null };
	}

	if (!isWithinExpiration(session.expiresAt)) {
		await deleteSessionByToken(token);
		return { user: null, session: null };
	}

	return { user: session.user, session };
}

export async function deleteSessionByToken(token: string): Promise<void> {
	await prisma.authSession.deleteMany({
		where: { token },
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(SESSION_TOKEN_NAME, { path: '/' });
}
