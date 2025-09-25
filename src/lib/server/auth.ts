import { PrismaClient } from '@prisma/client';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { AuthorInterface } from '$lib/types/types';

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.authSession, client.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: dev,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			first_name: attributes.first_name,
			last_name: attributes.last_name,
		};
	},
});

export const handleAuthRequest = (event: any) => {
	return {
		validate: async () => {
			const sessionId = event.cookies.get(lucia.sessionCookieName);
			if (!sessionId) return null;

			const { session, user } = await lucia.validateSession(sessionId);
			return { session, user };
		},
	};
};

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<AuthorInterface, 'id'>;
	}
}

export type Auth = typeof lucia;
