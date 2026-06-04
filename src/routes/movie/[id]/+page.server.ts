import type { PageServerLoad } from './$types';
import { getMovieById, updateMovie } from '$lib/server/services/movieService';
import type { MovieWithViewsType } from '$lib/types/types';
import { type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { updateMovieSchema } from '$lib/schemas/movie';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { getSuccessMessage } from '$lib/utils/successMessages';
import { ValidationError, AppError } from '$lib/errors/errors';
import { uploadImage } from '$lib/server/utils/uploadImage';

export const load: PageServerLoad = async ({ params, locals }) => {
	const movie: MovieWithViewsType = await getMovieById(params.id);
	const updateMovieFormValidate = await superValidate(zod(updateMovieSchema));

	const userView = movie.views.find((view) => view.user_id === locals.user?.id);
	const isWatched = userView?.is_watched ?? false;
	const userRating = userView?.rating ?? null;

	return { updateMovieFormValidate, movie, user: locals.user, isWatched, userRating };
};

export const actions: Actions = {
	updateMovie: async ({ locals, request, params }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(updateMovieSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const imgFile = formData.get('img_src') as File | null;
			const backgroundImgFile = formData.get('background_img_src') as File | null;

			const imgSrc =
				imgFile && imgFile.size > 0 ? await uploadImage(imgFile, 'posters') : undefined;
			const backgroundImgSrc =
				backgroundImgFile && backgroundImgFile.size > 0
					? await uploadImage(backgroundImgFile, 'backgrounds')
					: undefined;

			await updateMovie(
				params.id,
				form.data,
				locals.user!.id,
				imgSrc,
				backgroundImgSrc,
			);

			return {
				form,
				message: getSuccessMessage('MOVIE_UPDATED'),
			};
		} catch (error: unknown) {
			if (error instanceof ValidationError || error instanceof AppError) {
				return message(form, { text: error.message }, { status: 400 });
			}

			throw error;
		}
	},
};
