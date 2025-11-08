import { prisma } from '$lib/server/db/prisma';
import { AppError, ValidationError } from '$lib/errors/errors';
import type { SuggestionMovie } from '@prisma/client';
import type { MovieWithViewsType } from '$lib/types/types';

export async function getAllMovies(): Promise<MovieWithViewsType[]> {
	try {
		return await prisma.movie.findMany({
			include: {
				views: { select: { is_watched: true, user_id: true } },
			},
		});
	} catch (error) {
		console.error('[MovieService] Failed to fetch movies:', error);
		throw new AppError('LOAD_FAILED');
	}
}

export async function getMovieById(id: string): Promise<MovieWithViewsType> {
	try {
		const movie = await prisma.movie.findUnique({
			where: { id },
			include: { views: { select: { is_watched: true, user_id: true } } },
		});

		if (!movie) throw new AppError('NOT_FOUND');
		return movie;
	} catch (error) {
		console.error('[MovieService] Error loading movie:', error);
		if (error instanceof AppError) throw error;
		throw new AppError('LOAD_FAILED');
	}
}

export async function findMovieInSuggestion(
	suggestionId: string,
	movieId: string,
): Promise<SuggestionMovie | null> {
	try {
		return await prisma.suggestionMovie.findUnique({
			where: {
				suggestion_id_movie_id: {
					suggestion_id: suggestionId,
					movie_id: movieId,
				},
			},
			include: { movie: true },
		});
	} catch (error) {
		console.error('[MovieService] Error finding movie in suggestion:', error);
		throw new AppError('LOAD_FAILED');
	}
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
		console.error('[MovieService] Error adding movie to suggestion:', error);
		if (error.code === 'P2002') throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
		throw new AppError('SERVER_ERROR');
	}
}

export async function createMovie(name: string, link?: string): Promise<MovieWithViewsType> {
	try {
		return await prisma.movie.create({
			data: { name, link },
			include: { views: { select: { is_watched: true, user_id: true } } },
		});
	} catch (error: any) {
		console.error('[MovieService] Error creating movie:', error);
		if (error.code === 'P2002') throw new ValidationError('MOVIE_WITH_SAME_NAME_ALREADY_EXISTS');
		throw new AppError('CREATE_ERROR_MOVIE');
	}
}
