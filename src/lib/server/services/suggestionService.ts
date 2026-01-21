import { prisma } from '$lib/server/db/prisma';
import { AppError } from '$lib/errors/errors';
import type { Suggestion } from '@prisma/client';
import type { SuggestionWithRelationsType } from '$lib/types/types';

export async function getAllSuggestions(): Promise<SuggestionWithRelationsType[]> {
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
}

export async function getSuggestionsByAuthorId(
	authorId: string,
): Promise<SuggestionWithRelationsType[]> {
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
}

export async function createSuggestion(
	name: string,
	description: string,
	authorId: string,
): Promise<Suggestion> {
	return await prisma.suggestion.create({
		data: {
			name,
			description,
			author_id: authorId,
		},
	});
}

export async function getSuggestionById(id: string): Promise<SuggestionWithRelationsType> {
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
}
