import { AppError } from '$lib/errors/errors';
import { prisma } from '$lib/server/prisma';
import type { Suggestion } from '@prisma/client';

export class SuggestionService {
	static async getAllSuggestions() {
		try {
			return await prisma.suggestion.findMany({
				include: {
					author: true,
					movies: true,
				},
			});
		} catch (error) {
			console.error('[SuggestionService] Failed to fetch suggestions:', error);
			throw new AppError('NOT_FOUND');
		}
	}

	static async getSuggestionsByAuthorId(authorId: string) {
		try {
			return await prisma.suggestion.findMany({
				where: { author_id: authorId },
				include: {
					author: true,
					movies: true,
				},
			});
		} catch (error) {
			console.error('[SuggestionService] Failed to fetch author suggestions:', error);
			throw new AppError('LOAD_FAILED');
		}
	}

	static async createSuggestion(data: Suggestion) {
		try {
			return await prisma.suggestion.create({
				data,
				include: {
					author: true,
					movies: true,
				},
			});
		} catch (error) {
			console.error('[SuggestionService] Failed to create suggestion:', error);
			throw new AppError('CREATE_ERROR_SUGGESTION');
		}
	}

	static async getSuggestionById(id: string) {
		try {
			const suggestion = await prisma.suggestion.findUnique({
				where: { id },
				include: {
					author: true,
					movies: {
						include: {
							movie: {
								select: {
									id: true,
									name: true,
									rating: true,
									views: true,
									img_src: true,
								},
							},
						},
					},
				},
			});

			if (!suggestion) {
				throw new AppError('NOT_FOUND');
			}

			return suggestion;
		} catch (error) {
			console.error('[SuggestionService] Error loading suggestion:', error);

			if (error instanceof AppError) {
				throw error;
			}

			throw new AppError('SERVER_ERROR');
		}
	}
}
