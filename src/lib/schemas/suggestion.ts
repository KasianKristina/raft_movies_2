import { z } from 'zod';

export const newSuggestionSchema = z.object({
	name: z.string().min(1, 'Название обязателено'),
	description: z.string(),
});

export const addToSuggestionSchema = z.object({
	suggestion_id: z.number().int().positive(),
	movie_id: z.number().int().positive(),
});
