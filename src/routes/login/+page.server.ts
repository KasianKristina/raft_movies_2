import { loginSchema } from '$lib/schemas/auth';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/services/authService';
import { SessionService } from '$lib/services/sessionService';
import { AuthError } from '$lib/errors/errors';

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

		try {
			const { email, password } = form.data;

			const user = await AuthService.loginUser(email, password);

			await SessionService.createUserSession(user.id, cookies);

			redirect(303, '/');
		} catch (error: unknown) {
			console.error('Login error:', error);

			if (error instanceof AuthError) {
				switch (error.code) {
					case 'INVALID_CREDENTIALS':
						return message(form, error.message, { status: 400 });
					case 'SESSION_CREATION_FAILED':
						return message(form, error.message, { status: 500 });
					default:
						return message(form, 'Login failed', { status: 500 });
				}
			}

			return message(form, 'An unexpected error occurred', { status: 500 });
		}
	},
};
