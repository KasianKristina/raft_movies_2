import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const movie = {
		name: 'Lost in space',
		description:
			'The mission to save Scarecrow takes an unexpected turn, throwing the Resolute into chaos. Judy hatches a plan to get a ship to Alpha Centauri.',
		score: '8.1',
		genres: ['Приключения', 'Фантастика'],
		number_of_seasons: 1,
		year_of_production: 2006,
		country: 'Россия',
		film_director: 'Мамору Хосода',
		time: 1234567,
		imgSrc: '/poster.png',
		backgroundImgSrc: '/poster.png',
	};

	return { movie };
};
