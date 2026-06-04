import {
	getSuggestionById,
	updateSuggestion,
} from '$lib/server/services/suggestionService';
import { deleteMovieFromSuggestion } from '$lib/server/services/movieService';
import type { PageServerLoad, Actions } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSuccessMessage } from '$lib/utils/successMessages.js';
import { newSuggestionSchema } from '$lib/schemas/suggestion';
import { ValidationError } from '$lib/errors/errors';

export const load: PageServerLoad = async ({ params, locals }) => {
	const suggestion = await getSuggestionById(params.id);
	const form = await superValidate(zod(newSuggestionSchema));

	return { suggestion, user: locals.user, form };
};

export const actions: Actions = {
	updateSuggestion: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(newSuggestionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await updateSuggestion(params.id, locals.user!.id, form.data);

			return {
				form,
				message: getSuccessMessage('SUGGESTION_UPDATED'),
			};
		} catch (error: unknown) {
			if (error instanceof ValidationError && error.code === 'NOT_AUTHORIZED') {
				return fail(403, { form });
			}
			if (error instanceof ValidationError) {
				return message(form, { text: error.message }, { status: 400 });
			}

			throw error;
		}
	},

	removeMovieFromSuggestion: async ({ params, locals, request }) => {
		const formData = await request.formData();
		const movieId = formData.get('movie_id') as string;

		try {
			await deleteMovieFromSuggestion(params.id, movieId, locals.user!.id);
			return { message: getSuccessMessage('SUGGESTION_UPDATED') };
		} catch (error: unknown) {
			if (error instanceof ValidationError && error.code === 'NOT_AUTHORIZED') {
				return fail(403, { error: 'NOT_AUTHORIZED' });
			}
			if (error instanceof ValidationError) {
				return fail(400, { error: error.message });
			}
			throw error;
		}
	},
};
