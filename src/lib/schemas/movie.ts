import { z } from 'zod';

export const newMovieSchema = z.object({
	name: z.string().min(1, 'Название обязателено').max(254, 'Название слишком длинное'),
	link: z.string().url('Некорректный url').optional(),
});

export const updateMovieSchema = z.object({
	name: z.string().min(1, 'Название обязателено').max(254, 'Название слишком длинное').trim(),
	link: z
		.string()
		.trim()
		.transform((value) => (value === '' ? undefined : value))
		.pipe(z.string().url('Некорректный url').optional()),
	description: z.string().max(254, 'Описание слишком длинное').trim().optional(),
	genres: z.array(z.string()).optional(),
	number_of_seasons: z
		.number()
		.int('Количество сезонов должно быть целым числом')
		.min(1, 'Количество сезонов должно быть не менее 1')
		.optional(),
	year_of_production: z
		.number()
		.int('Год должен быть целым числом')
		.min(1888, 'Год не может быть ранее 1888')
		.max(new Date().getFullYear() + 5, 'Недопутсимое значение года')
		.optional(),
	countries: z
		.array(
			z.string().min(1, 'Страна не может быть пустой').max(100, 'Название страны слишком длинное'),
		)
		.optional(),
	film_director: z.string().max(100, 'Имя режиссёра слишком длинное').trim().optional(),
	duration: z
		.number()
		.int('Длительность фильма в минутах должна быть целым числом')
		.min(1, 'Длительность фильма в минутах должна быть положительной')
		.optional(),
});
