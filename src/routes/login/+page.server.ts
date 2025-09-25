import { loginSchema } from '$lib/schemas/auth';
import { prisma } from '$lib/server/prisma';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { verify } from '@node-rs/argon2';
import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { delay } from '$lib/utils/delay';
import { AuthError } from '$lib/errors/errors';
import { createErrorResponse } from '$lib/errors';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		try {
			const user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				await delay(1000);
				throw new AuthError('INVALID_CREDENTIALS');
			}

			const isValid = await verify(user.password, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			if (!isValid) {
				await delay(1000);
				throw new AuthError('INVALID_CREDENTIALS');
			}

			await lucia.invalidateUserSessions(user.id);

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});

			throw redirect(302, '/');
		} catch (error: unknown) {
			if (error instanceof Error && 'status' in error && error.status === 302) {
				throw error;
			}

			const errorResponse = createErrorResponse(error);

			return fail(errorResponse.code === 'INVALID_CREDENTIALS' ? 400 : 500, {
				form,
				error: errorResponse,
			});
		}
	},
};
