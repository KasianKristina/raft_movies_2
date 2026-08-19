import type { Actions, PageServerLoad } from './$types';
import {
	getMovieById,
	updateMovie,
	toggleWatched,
	deleteMovie,
} from '$lib/server/services/movieService';
import { rateMovieAction } from '$lib/server/actions/rateMovie';
import type { MovieWithViewsType } from '$lib/types/types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateMovieSchema } from '$lib/schemas/movie';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { getSuccessMessage } from '$lib/utils/successMessages';
import { ValidationError, AppError } from '$lib/errors/errors';
import { uploadImage } from '$lib/server/utils/uploadImage';
import { splitList } from '$lib/utils/formatNames';

export const load: PageServerLoad = async ({ params, locals }) => {
	const movie: MovieWithViewsType = await getMovieById(params.id);
	const updateMovieFormValidate = await superValidate(
		{
			name: movie.name,
			link: movie.link ?? undefined,
			description: movie.description ?? undefined,
			genres: movie.genres.join(', '),
			countries: movie.countries.join(', '),
			number_of_seasons: movie.number_of_seasons ?? undefined,
			year_of_production: movie.year_of_production ?? undefined,
			film_director: movie.film_director ?? undefined,
			duration: movie.duration ?? undefined,
		},
		zod(updateMovieSchema),
	);

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
			const existingMovie = await getMovieById(params.id);

			if (existingMovie.created_by !== locals.user!.id) {
				return fail(403, { form });
			}

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
				{
					...form.data,
					genres: splitList(form.data.genres),
					countries: splitList(form.data.countries),
				},
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

	rateMovie: rateMovieAction,

	toggleWatched: async ({ locals, params }) => {
		const isWatched = await toggleWatched(locals.user!.id, params.id);

		return { isWatched };
	},

	deleteMovie: async ({ locals, params }) => {
		try {
			const movie = await getMovieById(params.id);

			if (movie.created_by !== locals.user!.id) {
				return fail(403, { error: 'NOT_AUTHORIZED' });
			}

			await deleteMovie(params.id);
			return { message: getSuccessMessage('MOVIE_DELETED') };
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				return fail(400, { error: error.message });
			}
			throw error;
		}
	},
};
