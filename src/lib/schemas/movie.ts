import { z } from './zod';

export const newMovieSchema = z.object({
	name: z.string().trim().min(1, 'Название обязателено').max(254, 'Название слишком длинное'),
	link: z
		.string()
		.trim()
		.transform((value) => (value === '' ? undefined : value))
		.pipe(z.string().url('Некорректный url').optional())
		.optional(),
});

export const updateMovieSchema = newMovieSchema.extend({
	description: z.string().max(254, 'Описание слишком длинное').trim().optional(),
	genres: z.string().trim().max(254, 'Список жанров слишком длинный').optional(),
	number_of_seasons: z
		.number()
		.int('Количество сезонов должно быть целым числом')
		.min(1, 'Количество сезонов должно быть не менее 1')
		.nullable()
		.optional(),
	year_of_production: z
		.number()
		.int('Год должен быть целым числом')
		.min(1888, 'Год не может быть ранее 1888')
		.max(new Date().getFullYear() + 5, 'Недопутсимое значение года')
		.nullable()
		.optional(),
	countries: z.string().trim().max(254, 'Список стран слишком длинный').optional(),
	film_director: z.string().max(100, 'Имя режиссёра слишком длинное').trim().optional(),
	duration: z
		.number()
		.int('Длительность фильма в минутах должна быть целым числом')
		.min(1, 'Длительность фильма в минутах должна быть положительной')
		.nullable()
		.optional(),
});

export type UpdateMovieSchema = z.infer<typeof updateMovieSchema>;

export type UpdateMoviePayload = Omit<UpdateMovieSchema, 'genres' | 'countries'> & {
	genres?: string[];
	countries?: string[];
};
