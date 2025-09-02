import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const movieId = parseInt(params.id);

		if (isNaN(movieId)) {
			throw error(400, 'Invalid movie ID');
		}

		const movie = await prisma.movie.findUnique({
			where: { id: movieId },
		});

		if (!movie) {
			throw error(404, 'Movie not found');
		}

		const serializableMovie = {
			...movie,
			rating: movie.rating ? Number(movie.rating) : null,
			genres: [],
		};

		return {
			movie: serializableMovie,
		};
	} catch (err) {
		console.error('Error loading movie:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Failed to load movie');
	}
};
