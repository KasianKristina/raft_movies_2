import { registrationSchema } from '$lib/schemas/auth';
import { prisma } from '$lib/server/prisma';
import { hash } from '@node-rs/argon2';
import { fail, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { delay } from '$lib/utils/delay';
import { ValidationError } from '$lib/errors/errors';
import { lucia } from '$lib/server/auth';
import { ERROR_MESSAGES } from '$lib/constants/error-messages';
import { createErrorResponse } from '$lib/errors';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(zod(registrationSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(registrationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, firstName, lastName } = form.data;

		try {
			const existingUser = await prisma.user.findUnique({
				where: { email },
				select: { id: true },
			});

			if (existingUser) {
				await delay(1000);
				throw new ValidationError('EMAIL_EXISTS', 'email');
			}

			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			const user = await prisma.user.create({
				data: {
					email,
					password: passwordHash,
					first_name: firstName,
					last_name: lastName,
				},
			});

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});

			throw redirect(302, '/');
		} catch (error: unknown) {
			console.error('Registration error:', error);

			if (error instanceof Error && 'status' in error && error.status === 302) {
				throw error;
			}

			if (typeof error === 'object' && error !== null && 'code' in error) {
				const prismaError = error as { code: string; meta?: any };

				if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('email')) {
					await delay(1000);
					return setError(form, 'email', ERROR_MESSAGES.VALIDATION.EMAIL_EXISTS);
				}
			}

			const errorResponse = createErrorResponse(error);

			return fail(500, {
				form,
				error: errorResponse,
			});
		}
	},
};
