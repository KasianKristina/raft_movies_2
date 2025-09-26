import { loginSchema } from '$lib/schemas/auth';
import { prisma } from '$lib/server/prisma';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { verify } from '@node-rs/argon2';
import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { delay } from '$lib/utils/delay';
import { createErrorResponse } from '$lib/errors';
import { ERROR_MESSAGES } from '$lib/constants/error-messages';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}

	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			await delay(1000);
			return setError(form, 'email', ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
		}

		const isValid = await verify(user.password, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});

		if (!isValid) {
			await delay(1000);
			return setError(form, 'email', ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
		}

		try {
			await lucia.invalidateUserSessions(user.id);
			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		} catch (error) {
			console.error('Session creation error:', error);
			return fail(500, {
				form,
				error: createErrorResponse(new Error('SESSION_CREATION_FAILED')),
			});
		}

		redirect(302, '/');
	},
};
