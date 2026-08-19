<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Score from '$lib/components/Score.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';
	import VideoPlayIcon from '$lib/icons/VideoPlayIcon.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateMovieSchema } from '$lib/schemas/movie';
	import type { PageData, SubmitFunction } from './$types';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
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
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	const user = $derived(data.user);
	const movie = $derived(data.movie);

	let isEditing = $state(false);
	let showDeleteConfirmationModal = $state(false);
	let isDeleting = $state(false);
	let showRatingModal = $state(false);
	let deleteMovieFormEl: HTMLFormElement;

	let isWatched = $derived(data.isWatched);
	const userRating = $derived(data.userRating);

	const submitToggleWatched: SubmitFunction = () => {
		isWatched = !isWatched;

		return async ({ result }) => {
			if (result.type === 'success' && result.data && 'isWatched' in result.data) {
				const updatedIsWatched = result.data.isWatched;

				await invalidateAll();

				toast.success(updatedIsWatched ? 'Отмечено как просмотренное!' : 'Отметка снята');

				if (updatedIsWatched) {
					showRatingModal = true;
				}
			} else {
				isWatched = data.isWatched;
				toast.error('Ошибка при обновлении статуса');
			}
		};
	};

	const submitDeleteMovie: SubmitFunction = () => {
		isDeleting = true;

		return async ({ result }) => {
			isDeleting = false;
			showDeleteConfirmationModal = false;

			if (result.type === 'success') {
				goto(resolve('/movies'));
			} else {
				toast.error('Ошибка при удалении фильма');
			}
		};
	};

	const {
		form: updateMovieForm,
		errors: updateMovieErrors,
		enhance: updateMovieEnhance,
		reset: resetUpdateMovieForm,
	} = superForm(data.updateMovieFormValidate, {
		invalidateAll: true,
		resetForm: false,
		validators: zodClient(updateMovieSchema),
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Фильм успешно обновлён!');
				isEditing = false;
			}
		},
		onError() {
			toast.error('Ошибка при обновлении фильма');
		},
	});

	const cancelEdit = () => {
		resetUpdateMovieForm({ data: data.updateMovieFormValidate.data });
		isEditing = false;
	};

	const handleRated = async (newUserRating: number) => {
		await invalidateAll();
		toast.success(`Оценка ${newUserRating}/10 сохранена!`);
	};

	const handleDeleteMovie = () => {
		deleteMovieFormEl.requestSubmit();
	};
</script>

<svelte:head>
	<title>{`О фильме ${data.movie.name}`}</title>
</svelte:head>

<h1 class="visually-hidden">Информация о фильме {data.movie.name}</h1>

<form
	method="POST"
	action="?/updateMovie"
	enctype="multipart/form-data"
	novalidate
	use:updateMovieEnhance
>
	<section
		class="header-section"
		class:header-section--no-background={!data.movie.background_img_src}
	>
		<h2 class="visually-hidden">Постер к фильму</h2>
		{#if movie.created_by === user?.id}
			<div
				class="header-section__form-actions"
				class:header-section__form-actions--editing={isEditing}
			>
				{#if isEditing}
					<Button type="submit">
						<SuccessIcon />
						<span>Сохранить</span>
					</Button>
					<Button type="button" onclick={cancelEdit}>
						<CloseIcon />
						<span>Отменить</span>
					</Button>
				{:else}
					<Button type="button" onclick={() => (isEditing = true)}>
						<EditIcon />
						<span>Редактировать</span>
					</Button>
					<Button type="button" onclick={() => (showDeleteConfirmationModal = true)}>
						<TrashIcon />
						<span>Удалить</span>
					</Button>
				{/if}
			</div>
		{/if}
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
					{ text: 'Подборки', link: resolve('/suggestions') },
					{ text: data.movie.name, link: resolve('/movie/[id]', { id: data.movie.id }) },
				]}
			/>
			{#if isEditing}
				<Input
					label="Название фильма"
					type="string"
					name="name"
					required
					bind:value={$updateMovieForm.name}
					errorMessage={$updateMovieErrors.name?.[0] as string}
				/>
			{:else}
				<p class="header-section__name">{data.movie.name}</p>
			{/if}

			{#if movie.created_by === user?.id && isEditing}
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
							type="submit"
							form="toggle-watched-form"
						>
							<VideoTickIcon />
						</button>
					</Tooltip>
				</div>
				{#if isEditing}
					<div class="info-section__upload">
						<p class="info-section__upload-label">
							{data.movie.img_src ? 'Заменить постер' : 'Загрузить постер'}
						</p>
						<input class="info-section__file-input" type="file" name="img_src" accept="image/*" />
					</div>
				{/if}
			</div>
			<div>
				{#if isEditing}
					<Textarea
						label="Описание"
						name="description"
						bind:value={$updateMovieForm.description}
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
						{#if isEditing}
							<Input
								label="Жанр"
								type="string"
								name="genres"
								bind:value={$updateMovieForm.genres}
								errorMessage={$updateMovieErrors.genres?.[0] as string}
							/>
						{:else}
							<h3 class="info-section__detail-key">Жанр</h3>
							<p class="info-section__detail-value">
								{movie.genres.length ? movie.genres.join(', ') : '—'}
							</p>
						{/if}
					</li>
					<li class="info-section__detail">
						{#if isEditing}
							<Input
								label="Год производства"
								type="number"
								name="year_of_production"
								bind:value={$updateMovieForm.year_of_production}
								errorMessage={$updateMovieErrors.year_of_production?.[0] as string}
							/>
						{:else}
							<h3 class="info-section__detail-key">Год производства</h3>
							<p class="info-section__detail-value">{movie.year_of_production ?? '—'}</p>
						{/if}
					</li>
					<li class="info-section__detail">
						{#if isEditing}
							<Input
								label="Страна"
								type="string"
								name="countries"
								bind:value={$updateMovieForm.countries}
								errorMessage={$updateMovieErrors.countries?.[0] as string}
							/>
						{:else}
							<h3 class="info-section__detail-key">Страна</h3>
							<p class="info-section__detail-value">
								{movie.countries.length ? movie.countries.join(', ') : '—'}
							</p>
						{/if}
					</li>
					<li class="info-section__detail">
						{#if isEditing}
							<Input
								label="Режиссер"
								type="string"
								name="film_director"
								bind:value={$updateMovieForm.film_director}
								errorMessage={$updateMovieErrors.film_director?.[0] as string}
							/>
						{:else}
							<h3 class="info-section__detail-key">Режиссер</h3>
							<p class="info-section__detail-value">{movie.film_director ?? '—'}</p>
						{/if}
					</li>
					<li class="info-section__detail">
						{#if isEditing}
							<Input
								label="Время (в минутах)"
								type="number"
								name="duration"
								bind:value={$updateMovieForm.duration}
								errorMessage={$updateMovieErrors.duration?.[0] as string}
							/>
						{:else}
							<h3 class="info-section__detail-key">Время</h3>
							<p class="info-section__detail-value">
								{movie.duration ? `${movie.duration} мин` : '—'}
							</p>
						{/if}
					</li>
					{#if isEditing}
						<li class="info-section__detail">
							<Input
								label="Ссылка (если есть)"
								type="string"
								name="link"
								bind:value={$updateMovieForm.link}
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
							<a
								class="info-section__detail-value info-section__link"
								href={movie.link}
								rel="external"
							>
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

<form
	id="toggle-watched-form"
	method="POST"
	action="?/toggleWatched"
	use:enhance={submitToggleWatched}
></form>

<form
	method="POST"
	action="?/deleteMovie"
	hidden
	bind:this={deleteMovieFormEl}
	use:enhance={submitDeleteMovie}
></form>

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

		.header-section__name {
			color: var(--grey-50);
			font: var(--type-heading-three);
		}
	}

	.info-section__wrapper {
		display: flex;
		align-items: center;
		gap: 70px;
		margin-top: 152px;
		margin-left: 70px;
	}

	.header-section__form-actions {
		display: flex;
		position: absolute;
		right: 62px;
		bottom: -92px;
		align-items: center;
		gap: 24px;
		z-index: 1;
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		background: var(--black-200);
		padding: 16px 24px;

		:global(.button) {
			display: flex;
			align-items: center;
			gap: 8px;
			border: none;
			background-color: transparent;
			padding: 5px;
			height: 24px;
			font: var(--type-link-regular);
		}

		:global(.button):first-child {
			color: var(--primary-400);
		}

		:global(.button):last-child {
			color: var(--error-300);
		}
	}

	.header-section__form-actions--editing :global(.button):first-child {
		color: var(--success-300);
	}

	.header-section--no-background .header-section__form-actions {
		position: static;
		justify-content: flex-end;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		background: transparent;
		padding: 0;
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
		.header-section__form-actions span {
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

	.header-section__upload-label {
		color: var(--grey-400);
		font: var(--type-body-regular);
	}

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
