<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import VideoTickIcon from '$lib/icons/VideoTick.svelte';
	import VideoPlayIcon from '$lib/icons/VideoPlayIcon.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';
	import LikeIcon from '$lib/icons/Like.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import { searchByWords } from '$lib/utils/search';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import type { MovieCardInterface } from '$lib/types/types';

	let inputValue = $state('');
	let showModal = $state(false);
	let showModalWithSuggestions = $state(false);
	let { data } = $props<{ data: PageData }>();

	const { form, errors, enhance } = superForm(data.form);

	const filteredMovies = $derived(searchByWords(data.movies as MovieCardInterface[], inputValue));
</script>

<svelte:head>
	<title>Поиск фильмов</title>
</svelte:head>

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
		<Button>Поиск</Button>
	</div>
	<p class="search-section__result_string">
		{filteredMovies?.length}
		{getNoun(filteredMovies?.length, 'Результат', 'Результата', 'Результатов')}
	</p>
</section>
<section>
	<h2 class="visually-hidden">Результаты поиска фильмов</h2>
	<ul class="cards">
		{#each filteredMovies as movie}
			<li class="cards__item">
				<MovieCard id={movie.id} name={movie.name} imgSrc={movie.imgSrc} score={movie.score}>
					{#snippet bottomChildren()}
						{#if movie.isAlreadyWatched}
							<div class="cards__item-text green-color">
								<VideoTickIcon />
								<p>Уже просмотрено</p>
							</div>
						{:else}
							<button
								class="cards__item-text"
								onclick={(e) => {
									e.preventDefault();
									showModalWithSuggestions = true;
								}}
							>
								<LikeIcon />
								<p>Предложить фильм</p>
							</button>
						{/if}
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

<Modal bind:open={showModal}>
	<div class="modal__wrapper">
		<p class="modal__title">Предложи что-нибудь для просмотра</p>
		<form class="modal__inputs_wrapper" method="POST" use:enhance>
			<Input
				label="Название"
				type="string"
				name="name"
				bind:value={$form.name}
				errorMessage={$errors.name?.[0] as string}
			>
				{#snippet leftIcon()}
					<VideoPlayIcon />
				{/snippet}
			</Input>
			<Input
				label="Ссылка (если есть)"
				type="string"
				name="link"
				bind:value={$form.link}
				errorMessage={$errors.link?.[0] as string}
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
	<form class="modal__wrapper" method="POST">
		<select class="modal__select">
			{#each data.suggestions as suggestion}
				<option>{suggestion.name}</option>
			{/each}
		</select>
		<Button type="submit">Добавить</Button>
	</form>
</Modal>

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
		gap: 8px;
		width: 100%;
		max-width: 513px;
		color: var(--grey-600);
	}

	.search-section__result_string {
		color: var(--grey-50);
		font: var(--type-link-regular);
	}

	.search-section__input_wrapper :global(.button) {
		width: auto;
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
		position: absolute;
		bottom: 0;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		margin-left: 8px;
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

	.green-color {
		color: var(--success-400);
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
