import { z } from './zod';

export const newSuggestionSchema = z.object({
	name: z.string().min(1, 'Название обязателено').max(254, 'Название слишком длинное'),
	description: z.string().optional(),
});

export const addToSuggestionSchema = z.object({
	suggestion_id: z.string().min(1, 'Suggestion ID обязательно'),
	movie_id: z.string().min(1, 'Movie ID обязательно'),
});
