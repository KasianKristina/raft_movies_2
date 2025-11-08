import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas/auth';
import { loginUser } from '$lib/server/services/authService';
import { createSession } from '$lib/server/services/sessionService';
import { AuthError } from '$lib/errors/errors';

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
			await createSession(user.id, cookies);
		} catch (error: unknown) {
			console.error('Login error:', error);
			if (error instanceof AuthError) {
				return message(form, { text: error.message }, { status: 400 });
			}
			return message(form, { text: 'Login failed' }, { status: 500 });
		}
		throw redirect(303, '/');
	},
};
