import { registrationSchema } from '$lib/schemas/auth';
import { fail, superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { ERROR_MESSAGES } from '$lib/constants/error-messages';
import { AuthService } from '$lib/services/authService';
import { SessionService } from '$lib/services/sessionService';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}

	const form = await superValidate(zod(registrationSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(registrationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, firstName, lastName } = form.data;

		try {
			const user = await AuthService.registerUser(email, password, firstName, lastName);

			await SessionService.createUserSession(user.id, cookies);
		} catch (error: any) {
			if (error.message === ERROR_MESSAGES.VALIDATION.EMAIL_EXISTS) {
				return setError(form, 'email', error.message);
			}
			return message(form, { status: 500, text: 'Registration failed. Please try again.' });
		}

		redirect(302, '/');
	},
};
