<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { createSearchIndex } from '$lib/utils/search';
	import type { PageData, SubmitFunction } from './$types';
	import TrashIcon from '$lib/icons/Trash.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newSuggestionSchema } from '$lib/schemas/suggestion';
	import { toast } from 'svelte-sonner';
	import EditIcon from '$lib/icons/Edit.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import DeleteConfirmationModal from '$lib/components/DeleteConfirmationModal.svelte';
	import RatingModal from '$lib/components/RatingModal.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance as formEnhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
	const { form: formData } = data;

	const user = $derived(data.user);

	let inputValue = $state('');
	let isEditing = $state(false);
	let showDeleteConfirmationModal = $state(false);
	let movieToDeleteId = $state<string | null>(null);
	let showDeleteMovieModal = $state(false);
	let isDeletingMovie = $state(false);
	let isDeletingSuggestion = $state(false);

	let watchedMap = $derived(
		Object.fromEntries(
			data.suggestion.movies.map(({ movie }) => [
				movie.id,
				movie.views.find((view) => view.user_id === user?.id)?.is_watched ?? false,
			]),
		),
	);

	const ratingMap = $derived(
		Object.fromEntries(
			data.suggestion.movies.map(({ movie }) => [
				movie.id,
				movie.views.find((view) => view.user_id === user?.id)?.rating ?? null,
			]),
		),
	);

	let showRatingModal = $state(false);
	let ratingMovieId = $state<string | null>(null);
	let deleteSuggestionFormEl: HTMLFormElement;
	let removeMovieFormEl: HTMLFormElement;
	let removeMovieInputEl: HTMLInputElement;

	const moviesIndex = $derived(
		createSearchIndex(
			data.suggestion.movies.map((element) => element.movie),
			(movie) => movie.name,
		),
	);
	const filteredMovies = $derived(moviesIndex.search(inputValue));

	let {
		form,
		errors,
		enhance,
		reset: resetSuggestionForm,
	} = superForm(formData, {
		resetForm: false,
		validators: zodClient(newSuggestionSchema),
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Подборка успешно обновлена!');
				isEditing = false;
			}
		},
		onError() {
			toast.error('Ошибка при обновлении подборки');
		},
	});

	const handleRated = async (userRating: number) => {
		await invalidateAll();
		toast.success(`Оценка ${userRating}/10 сохранена!`);
	};

	const handleDelete = () => {
		deleteSuggestionFormEl.requestSubmit();
	};

	const handleRemoveMovie = () => {
		if (!movieToDeleteId) return;
		removeMovieInputEl.value = movieToDeleteId;
		removeMovieFormEl.requestSubmit();
	};

	const cancelEdit = () => {
		resetSuggestionForm({ data: data.form.data });
		isEditing = false;
	};

	const submitToggleWatched: SubmitFunction = ({ formData }) => {
		const movieId = formData.get('movie_id') as string;
		watchedMap = { ...watchedMap, [movieId]: !watchedMap[movieId] };

		return async ({ result }) => {
			if (result.type === 'success' && result.data && 'isWatched' in result.data) {
				const { isWatched } = result.data;

				await invalidateAll();

				toast.success(isWatched ? 'Отмечено как просмотренное!' : 'Отметка снята');

				if (isWatched) {
					ratingMovieId = movieId;
					showRatingModal = true;
				}
			} else {
				watchedMap = { ...watchedMap, [movieId]: !watchedMap[movieId] };
				toast.error('Ошибка при обновлении статуса');
			}
		};
	};

	const submitDeleteSuggestion: SubmitFunction = () => {
		isDeletingSuggestion = true;

		return async ({ result }) => {
			isDeletingSuggestion = false;
			showDeleteConfirmationModal = false;

			if (result.type === 'success') {
				goto(resolve('/suggestions'));
			} else {
				toast.error('Ошибка при удалении подборки');
			}
		};
	};

	const submitRemoveMovie: SubmitFunction = () => {
		isDeletingMovie = true;

		return async ({ result }) => {
			isDeletingMovie = false;
			showDeleteMovieModal = false;
			movieToDeleteId = null;

			if (result.type === 'success') {
				await invalidateAll();
			} else {
				toast.error('Ошибка при удалении фильма из подборки');
			}
		};
	};
</script>

<svelte:head>
	<title>{`Подборка фильмов ${data.suggestion.name}`}</title>
</svelte:head>

<h1 class="visually-hidden">{`Подборка фильмов ${data.suggestion.name}`}</h1>
<section>
	{#if isEditing}
		<h2 class="visually-hidden">{data.suggestion.name}</h2>
		<form class="form-editing" method="POST" action="?/updateSuggestion" novalidate use:enhance>
			<Input
				label="Название подборки"
				type="string"
				name="name"
				required
				bind:value={$form.name}
				errorMessage={$errors.name?.[0] as string}
			/>
			<Textarea label="Описание" name="description" bind:value={$form.description} />
			<div class="suggestion__updating">
				<Button type="button" onclick={cancelEdit}>
					<CloseIcon />
					<span>Отменить</span>
				</Button>
				<Button type="submit">Сохранить</Button>
			</div>
		</form>
	{:else}
		<div class="suggestion__title_wrapper">
			<div>
				<h2 class="title">{data.suggestion.name}</h2>
				<p class="suggestion__description">{data.suggestion.description}</p>
			</div>
			{#if data.suggestion.author.id === user?.id}
				<div class="suggestion__updating">
					<Button type="button" onclick={() => (isEditing = true)}>
						<EditIcon />
						<span>Редактировать</span>
					</Button>
					<Button type="button" onclick={() => (showDeleteConfirmationModal = true)}>
						<TrashIcon />
						<span>Удалить</span>
					</Button>
				</div>
			{/if}
		</div>
	{/if}
	<div class="suggestion__search-cards">
		<Input label="Поиск фильмов" bind:value={inputValue}>
			{#snippet leftIcon()}
				<SearchIcon />
			{/snippet}
		</Input>
		<Button>Поиск</Button>
	</div>
	<p class="suggestion__result-string">
		{filteredMovies.length}
		{getNoun(filteredMovies.length, 'Результат', 'Результата', 'Результатов')}
	</p>
	<ul class="suggestion__result_cards">
		{#each filteredMovies as movie (movie.id)}
			<li class="cards__item">
				<MovieCard
					id={movie.id}
					name={movie.name}
					imgSrc={movie.img_src}
					score={movie.rating}
					userRating={ratingMap[movie.id]}
					isWatched={watchedMap[movie.id]}
					onToggleWatchedSubmit={!isEditing ? submitToggleWatched : undefined}
					onOpenRating={!isEditing
						? () => {
								ratingMovieId = movie.id;
								showRatingModal = true;
							}
						: undefined}
				>
					{#snippet bottomChildren()}
						{#if data.suggestion.author.id === user?.id && isEditing}
							<button
								type="button"
								class="remove-movie-btn"
								onclick={() => {
									movieToDeleteId = movie.id;
									showDeleteMovieModal = true;
								}}
							>
								<TrashIcon />
							</button>
						{/if}
					{/snippet}
				</MovieCard>
			</li>
		{/each}
	</ul>
</section>
<DeleteConfirmationModal
	bind:isOpen={showDeleteConfirmationModal}
	itemType="подборку"
	itemName={data.suggestion.name}
	onConfirm={handleDelete}
	onCancel={() => (showDeleteConfirmationModal = false)}
	isDeleting={isDeletingSuggestion}
/>

<DeleteConfirmationModal
	bind:isOpen={showDeleteMovieModal}
	itemType="фильм из подборки"
	onConfirm={handleRemoveMovie}
	onCancel={() => {
		showDeleteMovieModal = false;
		movieToDeleteId = null;
	}}
	isDeleting={isDeletingMovie}
/>

<form
	method="POST"
	action="?/deleteSuggestion"
	hidden
	bind:this={deleteSuggestionFormEl}
	use:formEnhance={submitDeleteSuggestion}
></form>

<form
	method="POST"
	action="?/removeMovieFromSuggestion"
	hidden
	bind:this={removeMovieFormEl}
	use:formEnhance={submitRemoveMovie}
>
	<input type="hidden" name="movie_id" bind:this={removeMovieInputEl} />
</form>

<RatingModal
	bind:isOpen={showRatingModal}
	movieId={ratingMovieId ?? ''}
	currentRating={ratingMap[ratingMovieId ?? '']}
	onRated={handleRated}
/>

<style>
	.title {
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.form-editing {
		margin: 40px 0;

		.suggestion__updating {
			:global(.button):first-child {
				color: var(--error-300);
			}

			:global(.button):last-child {
				color: var(--success-300);
			}
		}
	}

	.suggestion__description {
		margin-bottom: 30px;
		color: var(--grey-50);
	}

	.suggestion__search-cards {
		display: flex;
		align-items: start;
		gap: 8px;
		width: 100%;
		max-width: 513px;
		color: var(--grey-600);
	}

	.suggestion__search-cards :global(.button) {
		width: auto;
	}

	.suggestion__result-string {
		color: var(--grey-50);
		font: var(--type-link-regular);
	}

	.suggestion__result_cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, 280px);
		justify-content: center;
		gap: 16px 24px;
		margin: 80px auto;
		width: 100%;
	}

	.suggestion__title_wrapper {
		display: flex;
		justify-content: space-between;
		align-items: start;
		margin-top: 80px;
		margin-bottom: 30px;
		width: 100%;

		.suggestion__updating {
			:global(.button):first-child {
				color: var(--primary-300);
			}

			:global(.button):last-child {
				color: var(--error-300);
			}
		}
	}

	.suggestion__updating {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.suggestion__updating :global(.button) {
		display: flex;
		align-items: center;
		gap: 8px;
		border: none;
		background-color: transparent;
		padding: 5px;
		height: 24px;
		color: var(--grey-600);
		font: var(--type-link-regular);
	}

	.cards__item {
		width: 100%;
	}

	.remove-movie-btn {
		display: flex;
		position: absolute;
		top: 8px;
		right: 8px;
		justify-content: center;
		align-items: center;
		opacity: 0.85;
		z-index: 1;
		cursor: pointer;
		border: none;
		border-radius: 8px;
		background-color: var(--black-200);
		padding: 6px;
		color: var(--error-300);

		&:hover {
			opacity: 1;
		}
	}

	@media (width <= 768px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.suggestion__search-cards {
			flex-direction: column;
			width: auto;
		}

		.suggestion__search-cards :global(.button) {
			width: 100%;
		}

		.suggestion__updating {
			span {
				display: none;
			}
		}
	}
</style>
