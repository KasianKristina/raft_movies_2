import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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

	const suggestion = {
		name: 'Советские фильмы',
		description:
			'Самые важные фильмы, снятые в СССР: авангардные шедевры Эйзенштейна, комедии Гайдая, экзистенциальные драмы Шепитько и многое другое',
	};

	return { suggestion, movies };
};
