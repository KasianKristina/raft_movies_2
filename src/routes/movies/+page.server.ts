import { newMovieSchema } from '$lib/schemas/movie';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { createErrorResponse } from '$lib/errors/index.js';
import { AuthError, ValidationError } from '$lib/errors/errors';
import { error, type Actions } from '@sveltejs/kit';
import { getSuccessMessage } from '$lib/utils/successMessages.js';
import { addToSuggestionSchema } from '$lib/schemas/suggestion';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw new AuthError('UNAUTHORIZED');
	}

	const createMovieForm = await superValidate(zod(newMovieSchema));
	const addToSuggestionForm = await superValidate(zod(addToSuggestionSchema));

	try {
		const movies = await prisma.movie.findMany();
		const suggestions = await prisma.suggestion.findMany({
			where: {
				author_id: locals.user.id,
			},
		});

		return {
			createMovieForm,
			addToSuggestionForm,
			movies: movies,
			suggestions: suggestions,
		};
	} catch (err: unknown) {
		console.error('Error loading movies:', err);

		return {
			createMovieForm,
			addToSuggestionForm,
			movies: [],
			suggestions: [],
			error: createErrorResponse(error),
		};
	}
};

export const actions: Actions = {
	createMovie: async () => {
		const form = await superValidate(zod(newMovieSchema));
		try {
			if (!form.valid) {
				return fail(400, { form });
			}

			await prisma.movie.create({
				data: {
					name: form.data.name,
					link: form.data.link,
				},
			});

			return {
				form,
				success: {
					message: getSuccessMessage('MOVIE_CREATED'),
					code: 'MOVIE_CREATED',
				},
			};
		} catch (error: unknown) {
			console.error('Error creating movie:', error);
			const errorResponse = createErrorResponse(error);
			return fail(500, { form, error: errorResponse });
		}
	},

	addToSuggestion: async ({ request }) => {
		const form = await superValidate(request, zod(addToSuggestionSchema));

		try {
			if (!form.data.suggestion_id) {
				throw new ValidationError('SUGGESTION_REQUIRED');
			}

			const existing = await prisma.suggestionMovie.findUnique({
				where: {
					suggestion_id_movie_id: {
						suggestion_id: form.data.suggestion_id,
						movie_id: form.data.movie_id,
					},
				},
			});

			if (existing) {
				throw new ValidationError('MOVIE_ALREADY_IN_SUGGESTION');
			}

			await prisma.suggestionMovie.create({
				data: {
					suggestion_id: form.data.suggestion_id,
					movie_id: form.data.movie_id,
				},
			});

			return {
				form,
				success: {
					message: getSuccessMessage('MOVIE_ADDED_TO_SUGGESTION'),
					code: 'MOVIE_ADDED_TO_SUGGESTION',
				},
			};
		} catch (error: unknown) {
			console.error('Error adding movie to suggestion:', error);
			const errorResponse = createErrorResponse(error);
			return fail(500, { form, error: errorResponse });
		}
	},
};
