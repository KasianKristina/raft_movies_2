import { fail } from 'sveltekit-superforms';
import { toggleWatched } from '$lib/server/services/movieService';

export const toggleWatchedAction = async ({
	request,
	locals,
}: {
	request: Request;
	locals: App.Locals;
}) => {
	const formData = await request.formData();
	const movieId = formData.get('movie_id');

	if (typeof movieId !== 'string') {
		return fail(400, { error: 'INVALID_MOVIE_ID' });
	}

	const isWatched = await toggleWatched(locals.user!.id, movieId);

	return { movieId, isWatched };
};
