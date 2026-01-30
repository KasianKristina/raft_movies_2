import { getSuggestionById } from '$lib/server/services/suggestionService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const suggestion = await getSuggestionById(params.id);
	return { suggestion, user: locals.user };
};
