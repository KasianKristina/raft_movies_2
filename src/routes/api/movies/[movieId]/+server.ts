import { json } from '@sveltejs/kit';
import { deleteMovie, getMovieById } from '$lib/server/services/movieService';
import { ValidationError } from '$lib/errors/errors';

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		return json({ error: 'UNAUTHORIZED' }, { status: 401 });
	}

	const movie = await getMovieById(params.movieId);

	if (movie.created_by !== locals.user.id) {
		return json({ error: 'NOT_AUTHORIZED' }, { status: 403 });
	}

	try {
		await deleteMovie(params.movieId);
		return json({ success: true, message: 'MOVIE_DELETED' });
	} catch (error: unknown) {
		if (error instanceof ValidationError) {
			return json({ error: error.message }, { status: 400 });
		}
		throw error;
	}
}
