import { newSuggestionSchema } from '$lib/schemas/suggestion';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { AuthError } from '$lib/errors/errors';
import { getSuccessMessage } from '$lib/utils/successMessages';
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
		const form = await superValidate(request, zod(newSuggestionSchema));

		if (!locals.user) {
			throw new AuthError('UNAUTHORIZED');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		await createSuggestion(form.data.name, form.data.description, locals.user.id);

		return {
			form,
			success: {
				message: getSuccessMessage('SUGGESTION_CREATED'),
				code: 'SUGGESTION_CREATED',
			},
		};
	},
};
