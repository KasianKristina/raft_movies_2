import { suggestionsData } from '$lib/mockData';
import { newSuggestionSchema } from '$lib/schemas/suggestion';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(newSuggestionSchema));

	return { form, suggestions: suggestionsData.slice(2, 4) };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(newSuggestionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	},
};
