import { prisma } from '$lib/server/db/prisma';
import { AppError, ValidationError } from '$lib/errors/errors';
import type { SuggestionMovie } from '@prisma/client';
import type { MovieWithViewsType } from '$lib/types/types';

export async function getAllMovies(): Promise<MovieWithViewsType[]> {
	return await prisma.movie.findMany({
		include: {
			views: { select: { is_watched: true, user_id: true } },
		},
	});
}

export async function getMovieById(id: string): Promise<MovieWithViewsType> {
	const movie = await prisma.movie.findUnique({
		where: { id },
		include: { views: { select: { is_watched: true, user_id: true } } },
	});

	if (!movie) throw new AppError('NOT_FOUND');
	return movie;
}

export async function findMovieInSuggestion(
	suggestionId: string,
	movieId: string,
): Promise<SuggestionMovie | null> {
	return await prisma.suggestionMovie.findUnique({
		where: {
			suggestion_id_movie_id: {
				suggestion_id: suggestionId,
				movie_id: movieId,
			},
		},
		include: { movie: true },
	});
}

export async function addMovieToSuggestion(
	suggestionId: string,
	movieId: string,
): Promise<SuggestionMovie> {
	try {
		return await prisma.suggestionMovie.create({
			data: { suggestion_id: suggestionId, movie_id: movieId },
			include: { movie: true },
		});
	} catch (error: any) {
		if (error.code === 'P2002') throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
		throw error;
	}
}

export async function createMovie(name: string, link?: string): Promise<MovieWithViewsType> {
	try {
		return await prisma.movie.create({
			data: { name, link },
			include: { views: { select: { is_watched: true, user_id: true } } },
		});
	} catch (error: any) {
		if (error.code === 'P2002') throw new ValidationError('MOVIE_WITH_SAME_NAME_ALREADY_EXISTS');
		throw error;
	}
}
