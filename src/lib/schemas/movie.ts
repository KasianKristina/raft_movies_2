import { z } from 'zod';

export const newMovieSchema = z.object({
	name: z.string().min(1, 'Название обязателено').max(254, 'Название слишком длинное'),
	link: z.string().url('Некорректный url').optional(),
});
