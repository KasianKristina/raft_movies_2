<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { createSearchIndex } from '$lib/utils/search';
	import type { PageData } from './$types';
	import TrashIcon from '$lib/icons/Trash.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { toast, Toaster } from 'svelte-sonner';
	import EditIcon from '$lib/icons/Edit.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import DeleteConfirmationModal from '$lib/components/DeleteConfirmationModal.svelte';
	import RatingModal from '$lib/components/RatingModal.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	let { form: formData, user } = data;

	let inputValue = $state('');
	let isEditing = $state(false);
	let showDeleteConfirmationModal = $state(false);
	let movieToDeleteId = $state<string | null>(null);
	let showDeleteMovieModal = $state(false);
	let isDeletingMovie = $state(false);
	let isDeletingSuggestion = $state(false);

	let watchedMap = $state<Record<string, boolean>>(
		Object.fromEntries(
			data.suggestion.movies.map(({ movie }) => [
				movie.id,
				movie.views.find((view) => view.user_id === user?.id)?.is_watched ?? false,
			]),
		),
	);

	let ratingMap = $state<Record<string, number | null>>(
		Object.fromEntries(
			data.suggestion.movies.map(({ movie }) => [
				movie.id,
				movie.views.find((view) => view.user_id === user?.id)?.rating ?? null,
			]),
		),
	);

	let showRatingModal = $state(false);
	let ratingMovieId = $state<string | null>(null);

	$effect(() => {
		if (!showRatingModal) ratingMovieId = null;
	});

	async function handleToggleWatched(movieId: string) {
		const previousValue = watchedMap[movieId];
		watchedMap[movieId] = !previousValue;

		try {
			const response = await fetch(`/api/movies/${movieId}/watched`, { method: 'POST' });

			if (response.ok) {
				const result = await response.json();
				watchedMap[movieId] = result.is_watched;
				toast.success(result.is_watched ? 'Отмечено как просмотренное!' : 'Отметка снята');
				if (result.is_watched) {
					ratingMovieId = movieId;
					showRatingModal = true;
				}
			} else {
				watchedMap[movieId] = previousValue;
				toast.error('Ошибка при обновлении статуса');
			}
		} catch {
			watchedMap[movieId] = previousValue;
			toast.error('Ошибка при обновлении статуса');
		}
	}

	const moviesIndex = $derived(
		createSearchIndex(
			data.suggestion.movies.map((element) => element.movie),
			(movie) => movie.name,
		),
	);
	const filteredMovies = $derived(moviesIndex.search(inputValue));

	let { form, errors, enhance } = superForm(formData, {
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

	let localName = $state(data.suggestion.name);
	let localDescription = $state(data.suggestion.description);

	async function handleRated(userRating: number) {
		if (ratingMovieId) {
			ratingMap[ratingMovieId] = userRating;
		}
		await invalidateAll();
		toast.success(`Оценка ${userRating}/10 сохранена!`);
	}

	async function handleDelete() {
		isDeletingSuggestion = true;

		try {
			const response = await fetch(`/api/suggestions/${data.suggestion.id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				goto('/suggestions');
			} else {
				toast.error('Ошибка при удалении подборки');
			}
		} catch {
			toast.error('Ошибка при удалении подборки');
		} finally {
			isDeletingSuggestion = false;
			showDeleteConfirmationModal = false;
		}
	}

	async function handleRemoveMovie() {
		isDeletingMovie = true;
		const formData = new FormData();
		formData.append('movie_id', movieToDeleteId!);

		try {
			const response = await fetch('?/removeMovieFromSuggestion', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				toast.error('Ошибка при удалении фильма из подборки');
			}
		} catch {
			toast.error('Ошибка при удалении фильма из подборки');
		} finally {
			isDeletingMovie = false;
			showDeleteMovieModal = false;
			movieToDeleteId = null;
		}
	}

	function cancelEdit() {
		localName = data.suggestion.name;
		localDescription = data.suggestion.description;
		isEditing = false;
	}
</script>

<svelte:head>
	<title>{`Подборка фильмов ${data.suggestion.name}`}</title>
</svelte:head>

<Toaster position="top-right" richColors />
<h1 class="visually-hidden">{`Подборка фильмов ${data.suggestion.name}`}</h1>
<section>
	{#if isEditing}
		<h2 class="visually-hidden">{data.suggestion.name}</h2>
		<form class="form-editing" method="POST" action="?/updateSuggestion" use:enhance>
			<Input
				label="Название подборки"
				type="string"
				name="name"
				bind:value={localName}
				errorMessage={$errors.name?.[0] as string}
			/>
			<Textarea label="Описание" name="description" bind:value={localDescription} />
			<div class="suggestion__updating">
				<Button onclick={cancelEdit}>
					<CloseIcon />
					<span>Отменить</span>
				</Button>
				<Button type="submit">Сохранить</Button>
			</div>
		</form>
	{:else if data.suggestion.author.id === user?.id}
		<div class="suggestion__title_wrapper">
			<div>
				<h2 class="title">{localName}</h2>
				<p class="suggestion__description">{localDescription}</p>
			</div>
			<div class="suggestion__updating">
				<Button onclick={() => (isEditing = true)}>
					<EditIcon />
					<span>Редактировать</span>
				</Button>
				<Button onclick={() => (showDeleteConfirmationModal = true)}>
					<TrashIcon />
					<span>Удалить</span>
				</Button>
			</div>
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
					onToggleWatched={!isEditing ? () => handleToggleWatched(movie.id) : undefined}
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
								onclick={(e) => {
									e.preventDefault();
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
