import type { PageServerLoad } from './$types';
import { MovieService } from '$lib/services/movieService';

export const load: PageServerLoad = async ({ params }) => {
	const movie = await MovieService.getMovieById(params.id);
	return { movie };
};
