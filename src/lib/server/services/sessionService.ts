import { prisma } from '$lib/server/db/prisma';
import type { Cookies } from '@sveltejs/kit';
import { createHash } from 'crypto';

const SESSION_TOKEN_NAME = 'session';
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
const SESSION_REFRESH_THRESHOLD = 1000 * 60 * 60 * 24 * 2; // 2 days

export interface SessionData {
	token: string;
	userId: string;
	expiresAt: Date;
}

function hashSessionToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

function isWithinExpiration(date: Date): boolean {
	return date.getTime() > Date.now();
}

function generateId(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createSession(userId: string) {
	const token = generateId(40);
	const tokenHash = hashSessionToken(token);
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

	const session = await prisma.authSession.create({
		data: {
			token: tokenHash,
			userId,
			expiresAt,
		},
	});

	return { token, session };
}

export async function validateSession(token?: string) {
	if (!token) {
		return { user: null, session: null };
	}

	const tokenHash = hashSessionToken(token);

	const session = await prisma.authSession.findUnique({
		where: { token: tokenHash },
		include: { user: true },
	});

	if (!session) {
		return { user: null, session: null };
	}

	if (!isWithinExpiration(session.expiresAt)) {
		await prisma.authSession.deleteMany({ where: { token: tokenHash } });
		return { user: null, session: null };
	}

	const timeLeft = session.expiresAt.getTime() - Date.now();
	if (timeLeft < SESSION_REFRESH_THRESHOLD) {
		const newExpiresAt = new Date(Date.now() + SESSION_MAX_AGE);
		await prisma.authSession.update({
			where: { token: tokenHash },
			data: { expiresAt: newExpiresAt },
		});
		session.expiresAt = newExpiresAt;
	}

	return { user: session.user, session };
}

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date) {
	cookies.set(SESSION_TOKEN_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		expires: expiresAt,
	});
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_TOKEN_NAME, { path: '/' });
}

export async function invalidateSession(token: string): Promise<void> {
	const sessionId = hashSessionToken(token);
	await prisma.authSession.deleteMany({
		where: { id: sessionId },
	});
}
