import { AuthError } from '$lib/errors/errors';
import { prisma } from '$lib/server/prisma';
import { generateRandomString } from '$lib/utils/auth';
import type { Cookies } from '@sveltejs/kit';

export class SessionService {
	static async createUserSession(userId: string, cookies: Cookies) {
		try {
			await this.deleteAllUserSessions(userId);

			const sessionToken = generateRandomString(64);
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 30);

			await prisma.authSession.create({
				data: {
					token: sessionToken,
					userId: userId,
					expiresAt: expiresAt,
				},
			});

			cookies.set('session', sessionToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: import.meta.env.PROD,
				expires: expiresAt,
			});

			return sessionToken;
		} catch {
			throw new AuthError('SESSION_CREATION_FAILED');
		}
	}

	private static async deleteAllUserSessions(userId: string) {
		try {
			await prisma.authSession.deleteMany({
				where: { userId: userId },
			});
		} catch (error) {
			console.error(`[SessionService] Error deleting user sessions:`, error);
			throw new Error('Failed to delete user sessions');
		}
	}

	static async deleteSessionByToken(token: string) {
		try {
			await prisma.authSession.deleteMany({
				where: { token },
			});
		} catch (error) {
			console.error(`[SessionService] Error deleting session:`, error);
			throw new Error('Failed to delete session');
		}
	}
}
