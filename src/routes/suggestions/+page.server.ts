import type { PageServerLoad } from './$types';
import { getAllSuggestions } from '$lib/server/services/suggestionService';
import type { SuggestionWithRelationsType } from '$lib/types/types';

export const load: PageServerLoad = async () => {
	const suggestions: SuggestionWithRelationsType[] = await getAllSuggestions();
	return { suggestions };
};
