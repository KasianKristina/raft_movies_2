import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { AppError, ValidationError } from '$lib/errors/errors';
import { createErrorResponse } from '$lib/errors';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const suggestionId = parseInt(params.id);

		if (isNaN(suggestionId)) {
			throw new ValidationError('INVALID_ID', 'id');
		}

		const suggestion = await prisma.suggestion.findUnique({
			where: { id: suggestionId },
			include: {
				movies: {
					include: {
						movie: {
							select: {
								id: true,
								name: true,
								rating: true,
								views: true,
							},
						},
					},
				},
			},
		});

		if (!suggestion) {
			throw new AppError('NOT_FOUND');
		}

		return { suggestion };
	} catch (err: unknown) {
		console.error('Error loading suggestion:', err);

		if (err instanceof AppError && err.code === 'NOT_FOUND') {
			throw error(404, err.message);
		}

		if (err instanceof ValidationError) {
			throw error(400, err.message);
		}

		const errorResponse = createErrorResponse(error);

		throw error(500, errorResponse.message);
	}
};
