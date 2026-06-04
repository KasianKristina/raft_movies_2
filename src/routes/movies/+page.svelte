<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import VideoPlayIcon from '$lib/icons/VideoPlayIcon.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';
	import LikeIcon from '$lib/icons/Like.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import { createSearchIndex } from '$lib/utils/search';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { Toaster, toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import DeleteConfirmationModal from '$lib/components/DeleteConfirmationModal.svelte';
	import RatingModal from '$lib/components/RatingModal.svelte';

	let { data }: { data: PageData } = $props();

	let inputValue = $state('');
	let showModal = $state(false);
	let showModalWithSuggestions = $state(false);
	let selectedMovieId: null | string = $state(null);
	let movieToDeleteId = $state<string | null>(null);
	let movieToDeleteName = $state<string | null>(null);
	let isDeleting = $state(false);
	let showRatingModal = $state(false);
	let ratingMovieId = $state<string | null>(null);
	let isDeleteModalOpen = $state(false);
	const { createMovieForm: createMovieFormData, addToSuggestionForm, suggestions, user } = data;

	let watchedMap = $state<Record<string, boolean>>(
		Object.fromEntries(
			data.movies.map((movie) => [
				movie.id,
				movie.views.find((view) => view.user_id === user?.id)?.is_watched ?? false,
			]),
		),
	);

	let ratingMap = $state<Record<string, number | null>>(
		Object.fromEntries(
			data.movies.map((movie) => [
				movie.id,
				movie.views.find((view) => view.user_id === user?.id)?.rating ?? null,
			]),
		),
	);

	$effect(() => {
		if (!showRatingModal) ratingMovieId = null;
		if (!isDeleteModalOpen) {
			movieToDeleteId = null;
			movieToDeleteName = null;
		}
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
		createSearchIndex(data.movies, (movie) =>
			[movie.name, movie.genres.join(' '), movie.film_director, movie.description]
				.filter(Boolean)
				.join(' '),
		),
	);
	const filteredMovies = $derived(moviesIndex.search(inputValue));

	const {
		form: createMovieForm,
		errors: createMovieErrors,
		enhance: createMovieEnhance,
	} = superForm(createMovieFormData, {
		onUpdated({ form }) {
			if (form.valid) {
				showModal = false;
				toast.success('Фильм успешно создан!');
			}
		},
		onError() {
			toast.error('Ошибка при создании фильма');
		},
	});

	const { enhance: addToSuggestionEnhance } = superForm(addToSuggestionForm, {
		onUpdated({ form }) {
			if (form.valid) {
				showModalWithSuggestions = false;
				selectedMovieId = null;
				toast.success('Фильм успешно добавлен в подборку!');
			}
		},
		onError() {
			toast.error('Ошибка при добавлении фильма в подборку');
		},
	});

	async function handleRated(userRating: number) {
		if (ratingMovieId) {
			ratingMap[ratingMovieId] = userRating;
		}
		await invalidateAll();
		toast.success(`Оценка ${userRating}/10 сохранена!`);
	}

	async function handleDelete() {
		if (!movieToDeleteId) return;
		isDeleting = true;

		try {
			const response = await fetch(`/api/movies/${movieToDeleteId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				await invalidateAll();
				toast.success('Фильм успешно удален!');
			} else {
				toast.error('Ошибка при удалении');
			}
		} catch (error) {
			toast.error('Ошибка при удалении');
		} finally {
			isDeleting = false;
			movieToDeleteId = null;
			movieToDeleteName = null;
		}
	}
</script>

<svelte:head>
	<title>Поиск фильмов</title>
</svelte:head>

<Toaster position="top-right" richColors />
<h1 class="title">Предложи фильм</h1>
<section class="search-section">
	<h2 class="visually-hidden">Блок с поиском фильмов или телепередач</h2>
	<p class="search-section__suggest-text">
		Я буду очень признателен, если вы найдете время и предложите мне что-нибудь интересное для
		просмотра
	</p>

	<div class="search-section__input_wrapper">
		<Input label="Поиск фильмов или телешоу" bind:value={inputValue}>
			{#snippet leftIcon()}
				<SearchIcon />
			{/snippet}
		</Input>
		<Button onclick={() => (showModal = true)}>Предложить свой фильм</Button>
	</div>
	<p class="search-section__result_string">
		{filteredMovies.length}
		{getNoun(filteredMovies.length, 'Результат', 'Результата', 'Результатов')}
	</p>
</section>
<section>
	<h2 class="visually-hidden">Результаты поиска фильмов</h2>
	<ul class="cards">
		{#each filteredMovies as movie (movie.id)}
			<li class="cards__item">
				<MovieCard
					id={movie.id}
					name={movie.name}
					imgSrc={movie.img_src}
					score={movie.rating}
					userRating={ratingMap[movie.id]}
					isWatched={watchedMap[movie.id]}
					onToggleWatched={() => handleToggleWatched(movie.id)}
					onOpenRating={() => {
						ratingMovieId = movie.id;
						showRatingModal = true;
					}}
					onDelete={movie.created_by === user?.id
						? () => {
								movieToDeleteId = movie.id;
								movieToDeleteName = movie.name;
								isDeleteModalOpen = true;
							}
						: undefined}
				>
					{#snippet bottomChildren()}
						<button
							class="cards__item-text"
							onclick={(e) => {
								e.preventDefault();
								showModalWithSuggestions = true;
								selectedMovieId = movie.id;
							}}
						>
							<LikeIcon />
							<p>Добавить в подборку</p>
						</button>
					{/snippet}
				</MovieCard>
			</li>
		{/each}
	</ul>
</section>

<section class="suggest-manually">
	<h2 class="visually-hidden">Предложить свой фильм</h2>
	<p class="suggest-manually__text">Не нашли то, что искали?</p>
	<Button onclick={() => (showModal = true)}>Предложить свой фильм</Button>
</section>

<DeleteConfirmationModal
	bind:isOpen={isDeleteModalOpen}
	itemType="фильм"
	itemName={movieToDeleteName ?? ''}
	onConfirm={handleDelete}
	onCancel={() => (isDeleteModalOpen = false)}
	{isDeleting}
/>

<Modal bind:open={showModal}>
	<div class="modal__wrapper">
		<p class="modal__title">Предложи что-нибудь для просмотра</p>
		<form class="modal__inputs_wrapper" method="POST" action="?/createMovie" use:createMovieEnhance>
			<Input
				label="Название"
				type="string"
				name="name"
				bind:value={$createMovieForm.name}
				errorMessage={$createMovieErrors.name?.[0] as string}
			>
				{#snippet leftIcon()}
					<VideoPlayIcon />
				{/snippet}
			</Input>
			<Input
				label="Ссылка (если есть)"
				type="string"
				name="link"
				bind:value={$createMovieForm.link}
				errorMessage={$createMovieErrors.link?.[0] as string}
			>
				{#snippet leftIcon()}
					<LinkIcon />
				{/snippet}
			</Input>
			<Button type="submit">Предложить</Button>
		</form>
	</div>
</Modal>

<Modal bind:open={showModalWithSuggestions}>
	<p class="modal__title">Добавить фильм в подборку</p>
	<form class="modal__wrapper" method="POST" action="?/addToSuggestion" use:addToSuggestionEnhance>
		<input type="hidden" name="movie_id" value={selectedMovieId} />
		<select class="modal__select" name="suggestion_id">
			{#each suggestions as suggestion (suggestion.id)}
				<option value={suggestion.id}>{suggestion.name}</option>
			{/each}
		</select>
		<Button type="submit">Добавить</Button>
	</form>
</Modal>

<RatingModal
	bind:isOpen={showRatingModal}
	movieId={ratingMovieId ?? ''}
	currentRating={ratingMap[ratingMovieId ?? '']}
	onRated={handleRated}
/>

<style>
	.title {
		margin-top: 80px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.search-section__suggest-text {
		margin-top: 16px;
		margin-bottom: 24px;
		color: var(--grey-300);
		font: var(--type-body-regular);
	}

	.search-section__input_wrapper {
		display: flex;
		align-items: start;
		gap: 10%;
		width: 100%;
		color: var(--grey-600);
	}

	.search-section__result_string {
		color: var(--grey-50);
		font: var(--type-link-regular);
	}

	.search-section__input_wrapper :global(.button) {
		width: auto;
		white-space: nowrap;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, 280px);
		justify-content: center;
		gap: 16px 24px;
		margin: 80px auto;
		width: 100%;
	}

	.suggest-manually {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		margin-bottom: 160px;
	}

	.suggest-manually__text {
		color: var(--grey-400);
		font: var(--type-body-large);
	}

	.cards__item {
		width: 100%;
	}

	.modal__title {
		margin-bottom: 40px;
		color: var(--grey-100);
		font: var(--type-heading-four);
		text-align: center;
	}

	.cards__item-text {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		margin-bottom: 16px;
		margin-left: 8px;
		border: none;
		background: transparent;
		color: var(--primary-400);

		p {
			font: var(--type-link-regular);
		}
	}

	.modal__inputs_wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		color: var(--grey-600);
	}

	.modal__wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.modal__select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin-bottom: 40px;
		border: 1px solid var(--grey-600);
		border-radius: 12px;
		background-image: url('$lib/icons/Add.svg');
		background-position: right 10px center;
		background-repeat: no-repeat;
		background-color: transparent;
		padding: 16px 12px;
		width: 100%;
		color: var(--grey-600);
		font-size: 16px;
	}

	@media (width <= 768px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.search-section__input_wrapper {
			flex-direction: column;
			width: auto;
		}

		.search-section__input_wrapper :global(.button),
		.suggest-manually :global(.button) {
			width: 100%;
		}

		.search-section__result_string {
			padding-top: 25px;
		}
	}
</style>
