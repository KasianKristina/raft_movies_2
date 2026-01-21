import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registrationSchema } from '$lib/schemas/auth';
import { registerUser } from '$lib/server/services/authService';
import { createSession, setSessionCookie } from '$lib/server/services/sessionService';
import { ValidationError } from '$lib/errors/errors';

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
			const { token, session } = await createSession(user.id);
			setSessionCookie(cookies, token, session.expiresAt);
		} catch (error) {
			if (error instanceof ValidationError) {
				return message(form, { text: error.message }, { status: 400 });
			}
			throw error;
		}

		throw redirect(303, '/');
	},
};
