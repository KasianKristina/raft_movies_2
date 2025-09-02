import { suggestionsData } from '$lib/mockData';
import { newMovieSchema } from '$lib/schemas/movie';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const form = await superValidate(zod(newMovieSchema));

	try {
		const movies = await prisma.movie.findMany();

		const serializableMovies = movies.map((movie) => ({
			...movie,
			rating: movie.rating ? Number(movie.rating) : null,
		}));

		return {
			form,
			movies: serializableMovies,
			suggestions: suggestionsData.slice(2, 3),
		};
	} catch (error) {
		console.error('Error loading movies:', error);
		return {
			form,
			movies: [],
			suggestions: suggestionsData.slice(2, 3),
			error: 'Failed to load movies',
		};
	}
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(newMovieSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	},
};
