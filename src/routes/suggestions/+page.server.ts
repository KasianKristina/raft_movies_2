import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { createErrorResponse } from '$lib/errors';

export const load: PageServerLoad = async () => {
	try {
		const suggestions = await prisma.suggestion.findMany({
			include: {
				author: true,
				movies: true,
			},
		});

		return { suggestions };
	} catch (error) {
		console.error('Error loading suggestions:', error);

		return {
			suggestions: [],
			error: createErrorResponse(error),
		};
	}
};
