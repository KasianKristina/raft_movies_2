import { z } from 'zod';

export const newSuggestionSchema = z.object({
	name: z.string().min(1, 'Название обязателено'),
	description: z.string(),
});

export const addToSuggestionSchema = z.object({
	suggestion_id: z.string().min(1, 'Suggestion ID обязательно'),
	movie_id: z.string().min(1, 'Movie ID обязательно'),
});
