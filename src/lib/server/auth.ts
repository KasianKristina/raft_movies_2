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
			secure: !dev,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			first_name: attributes.first_name,
			last_name: attributes.last_name,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<AuthorInterface, 'id'>;
	}
}

export type Auth = typeof lucia;
