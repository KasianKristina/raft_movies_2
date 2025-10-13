import type { PageServerLoad } from './$types';
import { SuggestionService } from '$lib/services/suggestionService';

export const load: PageServerLoad = async ({ params }) => {
	const suggestion = await SuggestionService.getSuggestionById(params.id);
	return { suggestion };
};
