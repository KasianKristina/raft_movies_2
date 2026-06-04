import { json } from '@sveltejs/kit';
import { setRating } from '$lib/server/services/movieService';

export async function POST({ params, locals, request }) {
	if (!locals.user) {
		return json({ error: 'UNAUTHORIZED' }, { status: 401 });
	}

	const { rating } = await request.json();

	if (typeof rating !== 'number' || rating < 1 || rating > 10) {
		return json({ error: 'INVALID_RATING' }, { status: 400 });
	}

	const { userRating, movieRating } = await setRating(locals.user.id, params.movieId, rating);

	return json({ user_rating: userRating, movie_rating: movieRating });
}
