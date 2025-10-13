import { AppError, ValidationError } from '$lib/errors/errors';
import { prisma } from '$lib/server/prisma';

export class MovieService {
	static async getAllMovies() {
		try {
			return await prisma.movie.findMany();
		} catch (error) {
			console.error('[MovieService] Failed to fetch movies:', error);
			throw new AppError('LOAD_FAILED');
		}
	}

	static async getMovieById(id: string) {
		try {
			const movie = await prisma.movie.findUnique({ where: { id } });
			if (!movie) {
				throw new AppError('NOT_FOUND');
			}
			return movie;
		} catch (error) {
			console.error('[MovieService] Error loading movie:', error);
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError('LOAD_FAILED');
		}
	}

	static async findMovieInSuggestion(suggestionId: string, movieId: string) {
		try {
			return await prisma.suggestionMovie.findUnique({
				where: {
					suggestion_id_movie_id: {
						suggestion_id: suggestionId,
						movie_id: movieId,
					},
				},
			});
		} catch (error) {
			console.error('[MovieService] Error finding movie in suggestion:', error);
			throw new AppError('LOAD_FAILED');
		}
	}

	static async addMovieToSuggestion(suggestionId: string, movieId: string) {
		try {
			return await prisma.suggestionMovie.create({
				data: {
					suggestion_id: suggestionId,
					movie_id: movieId,
				},
			});
		} catch (error) {
			console.error('[MovieService] Error adding movie to suggestion:', error);

			if (error instanceof Error && 'code' in error && error.code === 'P2002') {
				throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
			}

			throw new AppError('SERVER_ERROR');
		}
	}

	static async createMovie(name: string, link?: string) {
		try {
			return await prisma.movie.create({
				data: { name, link },
			});
		} catch (error) {
			console.error('[MovieService] Error creating movie:', error);

			if (error instanceof Error && 'code' in error && error.code === 'P2002') {
				throw new ValidationError('MOVIE_WITH_SAME_NAME_ALREADY_EXISTS');
			}

			throw new AppError('CREATE_ERROR_MOVIE');
		}
	}
}
