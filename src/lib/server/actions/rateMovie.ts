import { fail } from 'sveltekit-superforms';
import { setRating } from '$lib/server/services/movieService';
import type { RateMovieResultType } from '$lib/types/types';

export const rateMovieAction = async ({
	request,
	locals,
}: {
	request: Request;
	locals: App.Locals;
}) => {
	const formData = await request.formData();
	const movieId = formData.get('movie_id');
	const rating = Number(formData.get('rating'));

	if (typeof movieId !== 'string') {
		return fail(400, { error: 'INVALID_MOVIE_ID' });
	}

	if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
		return fail(400, { error: 'INVALID_RATING' });
	}

	const { userRating, movieRating } = await setRating(locals.user!.id, movieId, rating);

	const result: RateMovieResultType = { userRating, movieRating };

	return result;
};
