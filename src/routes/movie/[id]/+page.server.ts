import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { AppError, ValidationError } from '$lib/errors/errors';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const movieId = parseInt(params.id);

		if (isNaN(movieId)) {
			throw new ValidationError('INVALID_ID', 'id');
		}

		const movie = await prisma.movie.findUnique({
			where: { id: movieId },
		});

		if (!movie) {
			throw new AppError('NOT_FOUND');
		}

		return { movie };
	} catch (err) {
		console.error('Error loading movie:', err);

		if (err instanceof AppError && 'status' in err) {
			throw error(404, err.message);
		}

		throw error(500, 'Failed to load movie');
	}
};
