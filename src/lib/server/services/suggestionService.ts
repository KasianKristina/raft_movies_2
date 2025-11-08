import { prisma } from '$lib/server/db/prisma';
import { AppError } from '$lib/errors/errors';
import type { Suggestion } from '@prisma/client';
import type { SuggestionWithRelationsType } from '$lib/types/types';

export async function getAllSuggestions(): Promise<SuggestionWithRelationsType[]> {
	try {
		return await prisma.suggestion.findMany({
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
	} catch (error) {
		console.error('[SuggestionService] Failed to fetch suggestions:', error);
		throw new AppError('NOT_FOUND');
	}
}

export async function getSuggestionsByAuthorId(
	authorId: string,
): Promise<SuggestionWithRelationsType[]> {
	try {
		return await prisma.suggestion.findMany({
			where: { author_id: authorId },
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
	} catch (error) {
		console.error('[SuggestionService] Failed to fetch author suggestions:', error);
		throw new AppError('LOAD_FAILED');
	}
}

export async function createSuggestion(
	name: string,
	description: string,
	authorId: string,
): Promise<Suggestion> {
	try {
		return await prisma.suggestion.create({
			data: {
				name,
				description,
				author_id: authorId,
			},
		});
	} catch (error) {
		console.error('[SuggestionService] Failed to create suggestion:', error);
		throw new AppError('CREATE_ERROR_SUGGESTION');
	}
}

export async function getSuggestionById(id: string): Promise<SuggestionWithRelationsType> {
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
		if (!suggestion) throw new AppError('NOT_FOUND');
		return suggestion;
	} catch (error) {
		console.error('[SuggestionService] Error loading suggestion:', error);
		if (error instanceof AppError) throw error;
		throw new AppError('SERVER_ERROR');
	}
}
