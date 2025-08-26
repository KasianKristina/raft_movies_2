import { movieData } from '$lib/mockData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { movie: movieData };
};
