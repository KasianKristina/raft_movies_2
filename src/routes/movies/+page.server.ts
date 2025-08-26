import { moviesData, suggestionsData } from '$lib/mockData';
import { newMovieSchema } from '$lib/schemas/movie';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(newMovieSchema));

	return { form, movies: moviesData, suggestions: suggestionsData.slice(2, 3) };
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
