import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const suggestions = [
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

	return { suggestions };
};
