import { newSuggestionSchema } from '$lib/schemas/suggestion';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(newSuggestionSchema));

	const suggestions = [
		{
			id: '3',
			name: 'Советские фильмы',
			description:
				'Самые важные фильмы, снятые в СССР: авангардные шедевры Эйзенштейна, комедии Гайдая, экзистенциальные драмы Шепитько и многое другое',
			author: 'Касьян Кристина',
			authorId: '1313',
			countAlreadyWatched: 1,
			countAll: 10,
		},
		{
			id: '4',
			name: '100 великих фильмов XXI века',
			description: '',
			author: 'Касьян Кристина',
			authorId: '1313',
			countAlreadyWatched: 3,
			countAll: 12,
		},
	];

	return { form, suggestions };
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
