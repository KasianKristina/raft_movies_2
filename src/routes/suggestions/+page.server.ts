import type { PageServerLoad } from './$types';
import { SuggestionService } from '$lib/services/suggestionService';

export const load: PageServerLoad = async () => {
	const suggestions = await SuggestionService.getAllSuggestions();
	return { suggestions };
};
