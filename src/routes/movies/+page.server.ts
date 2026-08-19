import { newMovieSchema } from '$lib/schemas/movie';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthError, ValidationError } from '$lib/errors/errors';
import { type Actions } from '@sveltejs/kit';
import { getSuccessMessage } from '$lib/utils/successMessages.js';
import { addToSuggestionSchema } from '$lib/schemas/suggestion';
import {
	addMovieToSuggestion,
	createMovie,
	deleteMovie,
	findMovieInSuggestion,
	getAllMovies,
	getMovieById,
} from '$lib/server/services/movieService';
import { getSuggestionsByAuthorId } from '$lib/server/services/suggestionService';
import { rateMovieAction } from '$lib/server/actions/rateMovie';
import { toggleWatchedAction } from '$lib/server/actions/toggleWatched';
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
		movies,
		suggestions,
		user: locals.user,
	};
};

export const actions: Actions = {
	createMovie: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newMovieSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createMovie(locals.user!.id, form.data.name, form.data.link);

			return {
				form,
				message: getSuccessMessage('MOVIE_CREATED'),
			};
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				return message(form, { text: error.message }, { status: 400 });
			}

			throw error;
		}
	},

	addToSuggestion: async ({ request }) => {
		const form = await superValidate(request, zod(addToSuggestionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const suggestionId = form.data.suggestion_id;
		const movieId = form.data.movie_id;

		const existing = await findMovieInSuggestion(suggestionId, movieId);
		if (existing) {
			return message(form, { text: 'Movie already in suggestion' }, { status: 400 });
		}
		try {
			await addMovieToSuggestion(suggestionId, movieId);

			return {
				form,
				message: getSuccessMessage('MOVIE_ADDED_TO_SUGGESTION'),
			};
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				return message(form, { text: error.message }, { status: 400 });
			}

			throw error;
		}
	},

	rateMovie: rateMovieAction,

	toggleWatched: toggleWatchedAction,

	deleteMovie: async ({ request, locals }) => {
		const formData = await request.formData();
		const movieId = formData.get('movie_id');

		if (typeof movieId !== 'string') {
			return fail(400, { error: 'INVALID_MOVIE_ID' });
		}

		try {
			const movie = await getMovieById(movieId);

			if (movie.created_by !== locals.user!.id) {
				return fail(403, { error: 'NOT_AUTHORIZED' });
			}

			await deleteMovie(movieId);
			return { message: getSuccessMessage('MOVIE_DELETED') };
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				return fail(400, { error: error.message });
			}
			throw error;
		}
	},
};
