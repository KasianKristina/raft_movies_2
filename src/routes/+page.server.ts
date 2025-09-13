import { newSuggestionSchema } from '$lib/schemas/suggestion';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { redirect, type Actions, error } from '@sveltejs/kit';
import { AppError, AuthError } from '$lib/errors/errors';
import { createErrorResponse } from '$lib/errors';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		if (!locals.user) {
			throw new AuthError('UNAUTHORIZED');
		}

		const form = await superValidate(zod(newSuggestionSchema));

		const suggestions = await prisma.suggestion.findMany({
			where: {
				author_id: locals.user.id,
			},
		});

		return { form, suggestions };
	} catch (error: unknown) {
		if (error instanceof AuthError) {
			throw redirect(302, '/login?redirectTo=/suggestions');
		}

		console.error('Error loading suggestions:', error);
		throw new AppError('LOAD_FAILED');
	}
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newSuggestionSchema));
		try {
			if (!locals.user) {
				throw new AuthError('UNAUTHORIZED');
			}

			if (!form.valid) {
				return fail(400, { form });
			}

			await prisma.suggestion.create({
				data: {
					name: form.data.name,
					description: form.data.description,
					author_id: locals.user.id,
				},
			});

			return {
				form,
				success: {
					message: 'Предложение успешно создано',
					code: 'SUGGESTION_CREATED',
				},
			};
		} catch (error: unknown) {
			console.error('Error creating suggestion:', error);

			const errorResponse = createErrorResponse(error);
			return fail(errorResponse.code === 'UNAUTHORIZED' ? 401 : 500, {
				form,
				error: errorResponse,
			});
		}
	},
};
