import { newMovieSchema } from '$lib/schemas/movie';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { createErrorResponse } from '$lib/errors/index.js';
import { AppError, AuthError } from '$lib/errors/errors';
import { error, type Actions } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw new AuthError('UNAUTHORIZED');
	}

	const form = await superValidate(zod(newMovieSchema));

	try {
		const movies = await prisma.movie.findMany();
		const suggestions = await prisma.suggestion.findMany({
			where: {
				author_id: locals.user.id,
			},
		});

		return {
			form,
			movies: movies,
			suggestions: suggestions,
		};
	} catch (err: unknown) {
		console.error('Error loading movies:', err);

		return {
			form: await superValidate(zod(newMovieSchema)),
			movies: [],
			suggestions: [],
			error: createErrorResponse(error),
		};
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(newMovieSchema));
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
					message: 'Фильм успешно добавлен',
					code: 'MOVIE_CREATED',
				},
			};
		} catch (error: unknown) {
			console.error('Error creating movie:', error);

			const errorResponse = createErrorResponse(error);
			return fail(500, {
				form,
				error: errorResponse,
			});
		}
	},
};
