import type { Actions, PageServerLoad } from './$types';
import { deleteSuggestion, getAllSuggestions } from '$lib/server/services/suggestionService';
import type { SuggestionWithRelationsType } from '$lib/types/types';
import { fail } from 'sveltekit-superforms';
import { ValidationError } from '$lib/errors/errors';
import { getSuccessMessage } from '$lib/utils/successMessages';

export const load: PageServerLoad = async ({ locals }) => {
	const suggestions: SuggestionWithRelationsType[] = await getAllSuggestions();
	return { suggestions, user: locals.user };
};

export const actions: Actions = {
	deleteSuggestion: async ({ request, locals }) => {
		const formData = await request.formData();
		const suggestionId = formData.get('suggestion_id');

		if (typeof suggestionId !== 'string') {
			return fail(400, { error: 'INVALID_SUGGESTION_ID' });
		}

		try {
			await deleteSuggestion(suggestionId, locals.user!.id);
			return { message: getSuccessMessage('SUGGESTION_DELETED') };
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
