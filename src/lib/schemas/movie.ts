import { z } from 'zod';

export const newMovieSchema = z.object({
	name: z.string().min(1, 'Название обязателено'),
	link: z.string().url('Некорректный url'),
});
