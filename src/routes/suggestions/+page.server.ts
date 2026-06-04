import type { PageServerLoad } from './$types';
import { getAllSuggestions } from '$lib/server/services/suggestionService';
import type { SuggestionWithRelationsType } from '$lib/types/types';

export const load: PageServerLoad = async ({ locals }) => {
	const suggestions: SuggestionWithRelationsType[] = await getAllSuggestions();
	return { suggestions, user: locals.user };
};
