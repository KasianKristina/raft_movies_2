import { newMovieSchema } from '$lib/schemas/movie';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { AppError, AuthError, ValidationError } from '$lib/errors/errors';
import { type Actions } from '@sveltejs/kit';
import { getSuccessMessage } from '$lib/utils/successMessages.js';
import { addToSuggestionSchema } from '$lib/schemas/suggestion';
import {
	addMovieToSuggestion,
	createMovie,
	findMovieInSuggestion,
	getAllMovies,
} from '$lib/server/services/movieService';
import { getSuggestionsByAuthorId } from '$lib/server/services/suggestionService';
import type { MovieWithViewsType, SuggestionWithRelationsType } from '$lib/types/types';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw new AuthError('UNAUTHORIZED');
	}

	const createMovieForm = await superValidate(zod(newMovieSchema));
	const addToSuggestionForm = await superValidate(zod(addToSuggestionSchema));

	const movies: MovieWithViewsType[] = await getAllMovies();
	const suggestions: SuggestionWithRelationsType[] = await getSuggestionsByAuthorId(locals.user.id);

	return {
		createMovieForm,
		addToSuggestionForm,
		movies: movies,
		suggestions: suggestions,
		user: locals.user,
	};
};

export const actions: Actions = {
	createMovie: async ({ request }) => {
		const form = await superValidate(request, zod(newMovieSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createMovie(form.data.name, form.data.link);

			return {
				form,
				message: getSuccessMessage('MOVIE_CREATED'),
			};
		} catch (error: unknown) {
			console.error('Error in createMovie action:', error);

			if (error instanceof AppError) {
				switch (error.code) {
					case 'DUPLICATE_MOVIE_ERROR':
						return message(form, { text: error.message }, { status: 400 });
					case 'CREATE_ERROR_MOVIE':
					default:
						return message(form, { text: error.message }, { status: 500 });
				}
			}

			return message(form, { text: 'Failed to create movie' }, { status: 500 });
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

			const existing = await findMovieInSuggestion(suggestionId, movieId);
			if (existing) {
				throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
			}

			await addMovieToSuggestion(suggestionId, movieId);

			return {
				form,
				message: getSuccessMessage('MOVIE_ADDED_TO_SUGGESTION'),
			};
		} catch (error: unknown) {
			console.error('Error in addToSuggestion action:', error);

			if (error instanceof ValidationError && error.code === 'MOVIE_ALREADY_IN_SUGGESTION') {
				return message(form, { text: error.message }, { status: 400 });
			}

			return message(form, { text: 'Failed to add movie to suggestion' }, { status: 500 });
		}
	},
};
