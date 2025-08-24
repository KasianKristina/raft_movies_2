import { z } from 'zod';

export const newSuggestionSchema = z.object({
	name: z.string().min(1, 'Название обязателено'),
	description: z.string(),
});
