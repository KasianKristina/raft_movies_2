<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Score from '$lib/components/Score.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';
	import VideoPlayIcon from '$lib/icons/VideoPlayIcon.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import TrashIcon from '$lib/icons/Trash.svelte';
	import EditIcon from '$lib/icons/Edit.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import SuccessIcon from '$lib/icons/Success.svelte';
	import DeleteConfirmationModal from '$lib/components/DeleteConfirmationModal.svelte';
	import VideoTickIcon from '$lib/icons/VideoTick.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import NoPhotoImage from '$lib/icons/NoPhoto.svelte';
	import RatingModal from '$lib/components/RatingModal.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	let { user, updateMovieFormValidate } = data;

	const movie = $derived(data.movie);

	let isEditing = $state(false);
	let showDeleteConfirmationModal = $state(false);
	let isDeleting = $state(false);
	let isWatched = $state(data.isWatched);
	let userRating = $state(data.userRating);
	let showRatingModal = $state(false);

	$effect(() => {
		isWatched = data.isWatched;
		userRating = data.userRating;
	});

	async function handleToggleWatched() {
		const previousValue = isWatched;
		isWatched = !isWatched;

		const response = await fetch(`/api/movies/${movie.id}/watched`, { method: 'POST' });

		if (response.ok) {
			const result = await response.json();
			isWatched = result.is_watched;
			toast.success(isWatched ? 'Отмечено как просмотренное!' : 'Отметка снята');
			if (result.is_watched) {
				showRatingModal = true;
			}
		} else {
			isWatched = previousValue;
			toast.error('Ошибка при обновлении статуса');
		}
	}

	const { errors: updateMovieErrors, enhance: updateMovieEnhance } = superForm(
		updateMovieFormValidate,
		{
			invalidateAll: true,
			onUpdated({ form }) {
				if (form.valid) {
					toast.success('Фильм успешно обновлён!');
					isEditing = false;
				}
			},
			onError() {
				toast.error('Ошибка при обновлении фильма');
			},
		},
	);

	const original = $derived({
		name: movie.name,
		description: movie.description,
		genres: movie.genres,
		number_of_seasons: movie.number_of_seasons,
		year_of_production: movie.year_of_production,
		countries: movie.countries,
		film_director: movie.film_director,
		duration: movie.duration,
		link: movie.link,
	});

	let localForm = $state({ ...original });

	function cancelEdit() {
		localForm = { ...original };
		isEditing = false;
	}

	async function handleRated(newUserRating: number) {
		userRating = newUserRating;
		await invalidateAll();
		toast.success(`Оценка ${newUserRating}/10 сохранена!`);
	}

	async function handleDeleteMovie() {
		isDeleting = true;
		try {
			const response = await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
			if (response.ok) {
				goto('/movies');
			} else {
				toast.error('Ошибка при удалении фильма');
			}
		} catch {
			toast.error('Ошибка при удалении фильма');
		} finally {
			isDeleting = false;
			showDeleteConfirmationModal = false;
		}
	}
</script>

<svelte:head>
	<title>{`О фильме ${data.movie.name}`}</title>
</svelte:head>

<h1 class="visually-hidden">Информация о фильме {data.movie.name}</h1>

<form method="POST" action="?/updateMovie" enctype="multipart/form-data" use:updateMovieEnhance>
	<section
		class="header-section"
		class:header-section--no-background={!data.movie.background_img_src}
	>
		<h2 class="visually-hidden">Постер к фильму</h2>
		{#if data.movie.background_img_src}
			<div class="header-section__image_wrapper">
				<img
					src={data.movie.background_img_src}
					alt={`постер к фильму ${data.movie.name}`}
					width={1200}
					height={480}
					class="header-section__image"
				/>
			</div>
		{/if}

		<div class="header-section__name-wrapper">
			<Breadcrumbs
				breadcrumbs={[
					{ text: 'Подборки', link: '/suggestions' },
					{ text: data.movie.name, link: `/movie/${data.movie.id}` },
				]}
			/>
			{#if isEditing}
				<Input
					label="Название фильма"
					type="string"
					name="name"
					bind:value={localForm.name}
					errorMessage={$updateMovieErrors.name?.[0] as string}
				/>
			{:else}
				<p>{data.movie.name}</p>
			{/if}

			{#if movie.created_by === user?.id}
				{#if !isEditing}
					<div class="header-section__updating">
						<Button
							type="button"
							onclick={() => {
								localForm = { ...original };
								isEditing = true;
							}}
						>
							<EditIcon />
							<span>Редактировать</span>
						</Button>
						<Button type="button" onclick={() => (showDeleteConfirmationModal = true)}>
							<TrashIcon />
							<span>Удалить</span>
						</Button>
					</div>
				{:else}
					<div class="header-section__updating">
						<Button type="submit">
							<SuccessIcon />
							<span>Сохранить</span>
						</Button>
						<Button type="button" onclick={cancelEdit}>
							<CloseIcon />
							<span>Отменить</span>
						</Button>
					</div>
					<div class="header-section__upload">
						<p class="header-section__upload-label">
							{data.movie.background_img_src
								? 'Заменить фоновое изображение'
								: 'Загрузить фоновое изображение'}
						</p>
						<input
							class="header-section__file-input"
							type="file"
							name="background_img_src"
							accept="image/*"
						/>
					</div>
				{/if}
			{/if}
		</div>
	</section>
	<section class="info-section">
		<h2 class="visually-hidden">О фильме</h2>
		<div
			class="info-section__wrapper"
			class:info-section__wrapper--no-background={!data.movie.background_img_src}
		>
			<div class="info-section__image-wrapper">
				{#if data.movie.img_src}
					<img
						src={data.movie.img_src}
						alt={`постер к фильму ${data.movie.name}`}
						width={480}
						height={720}
						class="info-section__image"
					/>
				{:else}
					<div class="info-section__image info-section__image--placeholder">
						<NoPhotoImage />
					</div>
				{/if}
				<div class="info-section__watched-wrapper">
					<Tooltip text={isWatched ? 'Просмотрено' : 'Отметить как просмотренное'}>
						<button
							class="info-section__btn-watched"
							class:info-section__btn-watched--active={isWatched}
							type="button"
							onclick={handleToggleWatched}
						>
							<VideoTickIcon />
						</button>
					</Tooltip>
				</div>
			</div>
			{#if isEditing}
				<div class="info-section__upload">
					<p class="info-section__upload-label">
						{data.movie.img_src ? 'Заменить постер' : 'Загрузить постер'}
					</p>
					<input class="info-section__file-input" type="file" name="img_src" accept="image/*" />
				</div>
			{/if}
			<div>
				{#if isEditing}
					<Textarea
						label="Описание"
						name="description"
						bind:value={localForm.description}
						errorMessage={$updateMovieErrors.description?.[0] as string}
					/>
				{:else}
					<p class="info-section__description">{movie.description}</p>
				{/if}
				<div class="info-section__score">
					<Score score={movie.rating} {userRating} onclick={() => (showRatingModal = true)} />
				</div>
				<ul class="info-section__details">
					<li class="info-section__detail">
						<h3 class="info-section__detail-key">Жанр</h3>
						{#if isEditing}
							<Input
								label="Жанр"
								type="string"
								name="genres"
								bind:value={localForm.genres}
								errorMessage={$updateMovieErrors.genres?.[0][0] as string}
							/>
						{:else}
							<p class="info-section__detail-value">
								{movie.genres.length ? movie.genres.join(', ') : '—'}
							</p>
						{/if}
					</li>
					<li class="info-section__detail">
						<h3 class="info-section__detail-key">Год производства</h3>
						{#if isEditing}
							<Input
								label="Год производства"
								type="number"
								name="year_of_production"
								bind:value={localForm.year_of_production}
								errorMessage={$updateMovieErrors.year_of_production?.[0] as string}
							/>
						{:else}
							<p class="info-section__detail-value">{movie.year_of_production ?? '—'}</p>
						{/if}
					</li>
					<li class="info-section__detail">
						<h3 class="info-section__detail-key">Страна</h3>
						{#if isEditing}
							<Input
								label="Страна"
								type="string"
								name="countries"
								bind:value={localForm.countries}
								errorMessage={$updateMovieErrors.countries?.[0][0] as string}
							/>
						{:else}
							<p class="info-section__detail-value">
								{movie.countries.length ? movie.countries.join(', ') : '—'}
							</p>
						{/if}
					</li>
					<li class="info-section__detail">
						<h3 class="info-section__detail-key">Режиссер</h3>
						{#if isEditing}
							<Input
								label="Режиссер"
								type="string"
								name="film_director"
								bind:value={localForm.film_director}
								errorMessage={$updateMovieErrors.film_director?.[0] as string}
							/>
						{:else}
							<p class="info-section__detail-value">{movie.film_director ?? '—'}</p>
						{/if}
					</li>
					<li class="info-section__detail">
						<h3 class="info-section__detail-key">Время</h3>
						{#if isEditing}
							<Input
								label="Время (в минутах)"
								type="number"
								name="duration"
								bind:value={localForm.duration}
								errorMessage={$updateMovieErrors.duration?.[0] as string}
							/>
						{:else if movie.duration}
							<p class="info-section__detail-value">{movie.duration} мин</p>
						{:else}
							<p class="info-section__detail-value">—</p>
						{/if}
					</li>
					{#if isEditing}
						<li class="info-section__detail">
							<h3 class="info-section__detail-key">Ссылка</h3>
							<Input
								label="Ссылка (если есть)"
								type="string"
								name="link"
								bind:value={localForm.link}
								errorMessage={$updateMovieErrors.link?.[0] as string}
							>
								{#snippet leftIcon()}
									<LinkIcon />
								{/snippet}
							</Input>
						</li>
					{:else if movie.link}
						<li class="info-section__detail">
							<h3 class="info-section__detail-key">Ссылка</h3>
							<a class="info-section__detail-value info-section__link" href={movie.link}>
								<VideoPlayIcon />
								Смотреть
							</a>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</section>
</form>

<DeleteConfirmationModal
	bind:isOpen={showDeleteConfirmationModal}
	itemName={movie.name}
	itemType="фильм"
	onConfirm={handleDeleteMovie}
	onCancel={() => (showDeleteConfirmationModal = false)}
	{isDeleting}
/>

<RatingModal
	bind:isOpen={showRatingModal}
	movieId={movie.id}
	currentRating={userRating}
	onRated={handleRated}
/>

<style>
	.header-section {
		position: relative;
		margin-top: 40px;
	}

	.header-section__image_wrapper {
		position: relative;
		width: 100%;
		height: 480px;
		overflow: hidden;
	}

	.header-section__image {
		display: block;
		border-radius: 40px;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.header-section__name-wrapper {
		display: flex;
		position: absolute;
		bottom: -92px;
		left: 62px;
		flex-direction: column;
		gap: 8px;
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		background: var(--black-200);
		padding: 40px;
		width: 560px;

		p {
			color: var(--grey-50);
			font: var(--type-heading-three);
		}
	}

	.header-section__updating {
		display: flex;
		gap: 12px;

		:global(.button) {
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

		:global(.button):first-child {
			color: var(--success-300);
		}

		:global(.button):last-child {
			color: var(--error-300);
		}
	}

	.info-section__wrapper {
		display: flex;
		align-items: center;
		gap: 70px;
		margin-top: 152px;
		margin-left: 70px;
	}

	.header-section--no-background .header-section__name-wrapper {
		position: relative;
		bottom: auto;
		left: auto;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		width: auto;
		max-width: 560px;
	}

	@media (width > 1080px) {
		.info-section__wrapper--no-background {
			margin-top: 40px;
		}
	}

	.info-section__wrapper--no-poster {
		margin-left: 0;
	}

	.info-section__description {
		color: var(--grey-300);
		font: var(--type-body-large);
	}

	.info-section__detail {
		display: flex;
		flex-direction: column;
		gap: 8px;
		color: var(--white-400);
	}

	.info-section__detail-key {
		color: var(--grey-400);
		font: var(--type-body-regular);
		overflow-wrap: break-word;
	}

	.info-section__detail-value {
		min-width: 0;
		color: var(--grey-100);
		font: var(--type-body-large);
	}

	.info-section__link {
		display: flex;
		align-items: center;
		gap: 6px;
		text-decoration: none;
	}

	.info-section__details {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 24px;
		width: 100%;
	}

	.info-section__score {
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 24px 0;
		width: fit-content;
	}

	.info-section__image-wrapper {
		position: relative;
		width: 100%;
		max-width: 300px;
	}

	.info-section__watched-wrapper {
		position: absolute;
		top: 8px;
		right: 8px;
		z-index: 1;
	}

	.info-section__btn-watched {
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.85;
		transition:
			color 0.2s ease,
			opacity 0.2s ease;
		cursor: pointer;
		border: none;
		border-radius: 8px;
		background-color: var(--black-200);
		padding: 6px;
		color: var(--grey-400);

		&:hover {
			opacity: 1;
			color: var(--success-300);
		}
	}

	.info-section__btn-watched--active {
		opacity: 1;
		color: var(--success-300);
	}

	.info-section {
		margin-bottom: 160px;
	}

	.info-section__image {
		border-radius: 24px;
		aspect-ratio: 2/3;
		width: 100%;
		height: auto;
		max-height: 621px;
		object-fit: cover;
	}

	.info-section__image--placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--black-200);

		:global(svg) {
			opacity: 0.25;
			width: 80px;
			height: 80px;
			color: var(--grey-400);
		}
	}

	@media (width <= 1080px) {
		.info-section__wrapper {
			flex-direction: column;
			align-items: flex-start;
			margin-top: 30px;
			margin-left: 0;
		}

		.header-section__name-wrapper {
			position: relative;
			top: auto;
			bottom: auto;
			left: auto;
			transform: none;
			padding: 20px;
			width: 100%;
		}

		.header-section__image_wrapper {
			display: none;
		}
	}

	@media (width <= 768px) {
		.header-section__updating span {
			display: none;
		}
	}

	@media (width <= 480px) {
		.info-section__details {
			grid-template-columns: 1fr;
		}

		.info-section__detail {
			width: 100%;
		}

		.info-section__description {
			font: var(--type-body-regular);
		}
	}

	.header-section__upload,
	.info-section__upload {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.header-section__upload-label,
	.info-section__upload-label {
		color: var(--grey-400);
		font: var(--type-caption);
	}

	.header-section__file-input,
	.info-section__file-input {
		cursor: pointer;
		border: 1px solid var(--grey-600);
		border-radius: 12px;
		background: transparent;
		padding: 10px 12px;
		width: 100%;
		color: var(--grey-300);
		font: var(--type-caption);

		&::file-selector-button {
			cursor: pointer;
			margin-right: 12px;
			border: none;
			border-radius: 8px;
			background: var(--grey-600);
			padding: 4px 10px;
			color: var(--grey-100);
			font: var(--type-caption);
		}
	}
</style>
