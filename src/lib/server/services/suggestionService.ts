import { prisma } from '$lib/server/db/prisma';
import { ValidationError } from '$lib/errors/errors';
import type { Prisma, Suggestion } from '@prisma/client';
import type { SuggestionWithRelationsType } from '$lib/types/types';

const SUGGESTION_INCLUDE = {
	author: true,
	movies: {
		include: {
			movie: { select: { id: true, name: true, rating: true, views: true, img_src: true } },
		},
	},
} satisfies Prisma.SuggestionInclude;

export async function getAllSuggestions(): Promise<SuggestionWithRelationsType[]> {
	return prisma.suggestion.findMany({
		include: SUGGESTION_INCLUDE,
	});
}

export async function getSuggestionsByAuthorId(
	authorId: string,
): Promise<SuggestionWithRelationsType[]> {
	return prisma.suggestion.findMany({
		where: { author_id: authorId },
		include: SUGGESTION_INCLUDE,
	});
}

export async function createSuggestion(
	name: string,
	authorId: string,
	description?: string,
): Promise<Suggestion> {
	return prisma.suggestion.create({
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
		include: SUGGESTION_INCLUDE,
	});
	if (!suggestion) throw new ValidationError('SUGGESTION_NOT_FOUND');
	return suggestion;
}

export async function deleteSuggestion(suggestionId: string, userId: string): Promise<void> {
	const suggestion = await prisma.suggestion.findUnique({
		where: { id: suggestionId },
		select: { author_id: true },
	});

	if (!suggestion) throw new ValidationError('SUGGESTION_NOT_FOUND');
	if (suggestion.author_id !== userId) throw new ValidationError('NOT_AUTHORIZED');

	await prisma.suggestion.delete({ where: { id: suggestionId } });
}

export async function updateSuggestion(
	suggestionId: string,
	userId: string,
	data: {
		name?: string;
		description?: string;
	},
): Promise<Suggestion> {
	const suggestion = await prisma.suggestion.findUnique({
		where: { id: suggestionId },
		select: { author_id: true },
	});

	if (!suggestion) throw new ValidationError('SUGGESTION_NOT_FOUND');
	if (suggestion.author_id !== userId) throw new ValidationError('NOT_AUTHORIZED');

	return prisma.suggestion.update({
		where: { id: suggestionId },
		data: {
			...(data.name !== undefined && { name: data.name }),
			...(data.description !== undefined && { description: data.description }),
		},
	});
}
