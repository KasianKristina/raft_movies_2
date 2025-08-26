export const suggestionsData = [
	{
		id: '1',
		name: 'Подборка 1',
		description: 'Описание подборки 1',
		author: 'Иван Иванов',
		authorId: '1111',
		countAlreadyWatched: 0,
		countAll: 0,
	},
	{
		id: '2',
		name: 'Подборка с очень длинным названием',
		description: 'Длинное описание для подборки 2',
		author: 'Петр Петров',
		authorId: '1212',
		countAlreadyWatched: 1,
		countAll: 5,
	},
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
	{
		id: '5',
		name: 'Фильмы про космос',
		description: 'Cписок лучших фильмов про космические путешествия',
		author: 'Иван Иванов',
		authorId: '1111',
		countAlreadyWatched: 0,
		countAll: 7,
	},
];

export const moviesData = [
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

export const movieData = {
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
