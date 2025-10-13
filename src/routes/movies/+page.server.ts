import { newMovieSchema } from '$lib/schemas/movie';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { AppError, AuthError, ValidationError } from '$lib/errors/errors';
import { type Actions } from '@sveltejs/kit';
import { getSuccessMessage } from '$lib/utils/successMessages.js';
import { addToSuggestionSchema } from '$lib/schemas/suggestion';
import { SuggestionService } from '$lib/services/suggestionService';
import { MovieService } from '$lib/services/movieService';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw new AuthError('UNAUTHORIZED');
	}

	const createMovieForm = await superValidate(zod(newMovieSchema));
	const addToSuggestionForm = await superValidate(zod(addToSuggestionSchema));

	const movies = MovieService.getAllMovies();
	const suggestions = SuggestionService.getSuggestionsByAuthorId(locals.user.id);

	return {
		createMovieForm,
		addToSuggestionForm,
		movies: movies,
		suggestions: suggestions,
	};
};

export const actions: Actions = {
	createMovie: async ({ request }) => {
		const form = await superValidate(request, zod(newMovieSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await MovieService.createMovie(form.data.name, form.data.link);

			return {
				form,
				message: getSuccessMessage('MOVIE_CREATED'),
			};
		} catch (error: unknown) {
			console.error('Error in createMovie action:', error);

			if (error instanceof AppError) {
				switch (error.code) {
					case 'DUPLICATE_MOVIE_ERROR':
						return message(form, { status: 400, text: error.message });
					case 'CREATE_ERROR_MOVIE':
					default:
						return message(form, { status: 500, text: error.message });
				}
			}

			return message(form, { status: 500, text: 'Failed to create movie' });
		}
	},

	addToSuggestion: async ({ request }) => {
		const form = await superValidate(request, zod(addToSuggestionSchema));

		try {
			if (!form.valid) {
				return fail(400, { form });
			}

			const suggestionId = String(form.data.suggestion_id);
			const movieId = String(form.data.movie_id);

			const existing = await MovieService.findMovieInSuggestion(suggestionId, movieId);
			if (existing) {
				throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
			}

			await MovieService.addMovieToSuggestion(suggestionId, movieId);

			return {
				form,
				message: getSuccessMessage('MOVIE_ADDED_TO_SUGGESTION'),
			};
		} catch (error: unknown) {
			console.error('Error in addToSuggestion action:', error);

			if (error instanceof ValidationError && error.code === 'MOVIE_ALREADY_IN_SUGGESTION') {
				return message(form, { status: 400, text: error.message });
			}

			return message(form, { status: 500, text: 'Failed to add movie to suggestion' });
		}
	},
};
