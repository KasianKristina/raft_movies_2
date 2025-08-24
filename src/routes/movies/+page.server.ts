import { newMovieSchema } from '$lib/schemas/movie';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(newMovieSchema));
	return { form };
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
