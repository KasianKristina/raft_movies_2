import { newSuggestionSchema } from '$lib/schemas/suggestion';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { AuthError } from '$lib/errors/errors';
import { createSuggestion, getSuggestionsByAuthorId } from '$lib/server/services/suggestionService';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login?redirectTo=/suggestions');
	}

	const form = await superValidate(zod(newSuggestionSchema));
	const suggestions = await getSuggestionsByAuthorId(locals.user.id);

	return { form, suggestions, user: locals.user };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) {
			throw new AuthError('UNAUTHORIZED');
		}

		const form = await superValidate(request, zod(newSuggestionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		await createSuggestion(form.data.name, locals.user.id, form.data.description);

		return { form };
	},
};
