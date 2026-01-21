import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas/auth';
import { loginUser } from '$lib/server/services/authService';
import { createSession, setSessionCookie } from '$lib/server/services/sessionService';
import { AuthError, ValidationError } from '$lib/errors/errors';
import { ERROR_MESSAGES } from '$lib/constants/error-messages';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/');
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { email, password } = form.data;
			const user = await loginUser(email, password);
			const { token, session } = await createSession(user.id);
			setSessionCookie(cookies, token, session.expiresAt);
		} catch (error) {
			if (error instanceof AuthError) {
				return message(form, { text: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS }, { status: 400 });
			}
			if (error instanceof ValidationError) {
				return message(form, { text: error.message }, { status: 400 });
			}
			throw error;
		}

		throw redirect(303, '/');
	},
};
