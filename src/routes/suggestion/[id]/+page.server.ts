import { moviesData, suggestionsData } from '$lib/mockData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { suggestion: suggestionsData[2], movies: moviesData };
};
