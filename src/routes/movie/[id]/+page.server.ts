import type { PageServerLoad } from './$types';
import { getMovieById } from '$lib/server/services/movieService';
import type { MovieWithViewsType } from '$lib/types/types';

export const load: PageServerLoad = async ({ params }) => {
	const movie: MovieWithViewsType = await getMovieById(params.id);
	return { movie };
};
