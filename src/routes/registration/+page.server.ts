import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registrationSchema } from '$lib/schemas/auth';
import { registerUser } from '$lib/server/services/authService';
import { createSession } from '$lib/server/services/sessionService';
import { AuthError } from '$lib/errors/errors';
import { ERROR_MESSAGES } from '$lib/constants/error-messages';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/');
	const form = await superValidate(zod(registrationSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(registrationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { email, password, firstName, lastName } = form.data;
			const user = await registerUser(email, password, firstName, lastName);
			await createSession(user.id, cookies);
		} catch (error: unknown) {
			console.error('Registration error:', error);

			if (error instanceof Error && error.message === ERROR_MESSAGES.VALIDATION.EMAIL_EXISTS) {
				return message(form, { text: error.message }, { status: 400 });
			}

			return message(form, { text: ERROR_MESSAGES.AUTH.REGISTRATION_FAILED }, { status: 500 });
		}

		throw redirect(303, '/');
	},
};
