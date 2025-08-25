import { newMovieSchema } from '$lib/schemas/movie';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(newMovieSchema));

	const movies = [
		{ id: '1', imgSrc: '/poster.png', name: 'Фильм 1', score: '8.1', isAlreadyWatched: false },
		{ id: '2', imgSrc: '/poster.png', name: 'Фильм 2', score: '5.8', isAlreadyWatched: false },
		{ id: '3', name: 'Фильм 3', score: '4.4', isAlreadyWatched: true },
		{
			id: '4',
			imgSrc: '/poster.png',
			name: 'Фильм 4 c очень-очень длинным названием',
			score: '9',
			isAlreadyWatched: false,
		},
		{ id: '5', imgSrc: '/poster.png', name: 'Фильм 5', score: '5.8', isAlreadyWatched: true },
		{ id: '6', imgSrc: '/poster.png', name: 'Фильм 6', score: '5.8', isAlreadyWatched: false },
	];

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

	return { form, movies, suggestions };
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
