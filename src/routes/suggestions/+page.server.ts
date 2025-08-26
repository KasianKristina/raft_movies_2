import type { PageServerLoad } from './$types';
import { suggestionsData } from '$lib/mockData';

export const load: PageServerLoad = async () => {
	return { suggestions: suggestionsData };
};
