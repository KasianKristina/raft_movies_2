import { prisma } from '$lib/server/db/prisma';
import { ValidationError } from '$lib/errors/errors';
import { Prisma, type SuggestionMovie } from '@prisma/client';
import type { MovieWithViewsType } from '$lib/types/types';
import type { UpdateMoviePayload } from '$lib/schemas/movie';

const MOVIE_INCLUDE = {
	views: { select: { is_watched: true, user_id: true, rating: true } },
} satisfies Prisma.MovieInclude;

export const getAllMovies = async (): Promise<MovieWithViewsType[]> => {
	return prisma.movie.findMany({
		include: MOVIE_INCLUDE,
	});
};

export const getMovieById = async (id: string): Promise<MovieWithViewsType> => {
	const movie = await prisma.movie.findUnique({
		where: { id },
		include: MOVIE_INCLUDE,
	});

	if (!movie) throw new ValidationError('MOVIE_NOT_FOUND');
	return movie;
};

export const findMovieInSuggestion = async (
	suggestionId: string,
	movieId: string,
): Promise<SuggestionMovie | null> => {
	return prisma.suggestionMovie.findUnique({
		where: {
			suggestion_id_movie_id: {
				suggestion_id: suggestionId,
				movie_id: movieId,
			},
		},
	});
};

export const addMovieToSuggestion = async (
	suggestionId: string,
	movieId: string,
): Promise<SuggestionMovie> => {
	try {
		return await prisma.suggestionMovie.create({
			data: { suggestion_id: suggestionId, movie_id: movieId },
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
		}
		throw error;
	}
};

export const deleteMovieFromSuggestion = async (
	suggestionId: string,
	movieId: string,
	userId: string,
): Promise<SuggestionMovie> => {
	const suggestion = await prisma.suggestion.findUnique({
		where: { id: suggestionId },
		select: { author_id: true },
	});

	if (!suggestion) throw new ValidationError('SUGGESTION_NOT_FOUND');
	if (suggestion.author_id !== userId) throw new ValidationError('NOT_AUTHORIZED');

	return prisma.suggestionMovie.delete({
		where: {
			suggestion_id_movie_id: {
				suggestion_id: suggestionId,
				movie_id: movieId,
			},
		},
	});
};

export const createMovie = async (
	userId: string,
	name: string,
	link?: string,
): Promise<MovieWithViewsType> => {
	try {
		return await prisma.movie.create({
			data: { name, link, created_by: userId },
			include: MOVIE_INCLUDE,
		});
	} catch (error) {
		if (error.code === 'P2002') throw new ValidationError('MOVIE_WITH_SAME_NAME_ALREADY_EXISTS');
		throw error;
	}
};

export const deleteMovie = async (movieId: string): Promise<void> => {
	await prisma.movie.delete({
		where: { id: movieId },
	});
};

export const updateMovie = async (
	movieId: string,
	data: UpdateMoviePayload,
	userId: string,
	imgSrc?: string,
	backgroundImgSrc?: string,
): Promise<MovieWithViewsType> => {
	const existingMovie = await prisma.movie.findUnique({
		where: { id: movieId },
	});

	if (!existingMovie) {
		throw new ValidationError('MOVIE_NOT_FOUND');
	}

	if (existingMovie.created_by !== userId) {
		throw new ValidationError('NOT_AUTHORIZED');
	}

	if (data.name && data.name !== existingMovie.name) {
		const movieWithSameName = await prisma.movie.findFirst({
			where: { name: data.name },
		});

		if (movieWithSameName && movieWithSameName.id !== movieId) {
			throw new ValidationError('MOVIE_WITH_SAME_NAME_ALREADY_EXISTS');
		}
	}

	return prisma.movie.update({
		where: { id: movieId },
		data: {
			name: data.name,
			link: data.link ?? null,
			description: data.description ?? null,
			genres: data.genres ?? [],
			number_of_seasons: data.number_of_seasons ?? null,
			year_of_production: data.year_of_production ?? null,
			countries: data.countries ?? [],
			film_director: data.film_director ?? null,
			duration: data.duration ?? null,
			img_src: imgSrc,
			background_img_src: backgroundImgSrc,
		},
		include: MOVIE_INCLUDE,
	});
};

export const setRating = async (
	userId: string,
	movieId: string,
	rating: number,
): Promise<{ userRating: number; movieRating: number }> => {
	await prisma.movieView.upsert({
		where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
		update: { rating },
		create: { user_id: userId, movie_id: movieId, rating },
	});

	const aggregate = await prisma.movieView.aggregate({
		where: { movie_id: movieId, rating: { not: null } },
		_avg: { rating: true },
	});

	const movieRating = aggregate._avg.rating ?? rating;

	await prisma.movie.update({
		where: { id: movieId },
		data: { rating: movieRating },
	});

	return { userRating: rating, movieRating };
};

export const toggleWatched = async (userId: string, movieId: string): Promise<boolean> => {
	const existingView = await prisma.movieView.findUnique({
		where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
	});

	const newIsWatched = existingView ? !existingView.is_watched : true;

	await prisma.movieView.upsert({
		where: { user_id_movie_id: { user_id: userId, movie_id: movieId } },
		update: { is_watched: newIsWatched },
		create: { user_id: userId, movie_id: movieId, is_watched: true },
	});

	return newIsWatched;
};
