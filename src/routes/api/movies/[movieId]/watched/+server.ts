import { json } from '@sveltejs/kit';
import { toggleWatched } from '$lib/server/services/movieService';

export async function POST({ params, locals }) {
	if (!locals.user) {
		return json({ error: 'UNAUTHORIZED' }, { status: 401 });
	}

	const isWatched = await toggleWatched(locals.user.id, params.movieId);
	return json({ is_watched: isWatched });
}
