import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const suggestionId = parseInt(params.id);

		if (isNaN(suggestionId)) {
			throw error(400, 'Invalid movie ID');
		}

		const suggestion = await prisma.suggestion.findUnique({
			where: { id: suggestionId },
		});

		if (!suggestion) {
			throw error(404, 'Movie not found');
		}

		return {
			suggestion: suggestion,
			movies: [],
		};
	} catch (err) {
		console.error('Error loading movie:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Failed to load movie');
	}
};
