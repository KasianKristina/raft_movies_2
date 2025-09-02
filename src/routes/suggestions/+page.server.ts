import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	try {
		const suggestions = await prisma.suggestion.findMany();

		return {
			suggestions: suggestions,
		};
	} catch (error) {
		console.error('Error loading movies:', error);
		return {
			suggestions: [],
			error: 'Failed to load movies',
		};
	}
};
