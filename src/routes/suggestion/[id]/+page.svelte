<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import Poster from '$lib/images/poster.png';
	import Card from '$lib/components/Card.svelte';
	import VideoTickIcon from '$lib/icons/VideoTick.svelte';

	const movies = [
		{ id: '1', imgSrc: Poster, name: 'Фильм 1', score: '8.1', isAlreadyWatched: false },
		{ id: '2', imgSrc: Poster, name: 'Фильм 2', score: '5.8', isAlreadyWatched: false },
		{ id: '3', name: 'Фильм 3', score: '4.4', isAlreadyWatched: true },
		{
			id: '4',
			imgSrc: Poster,
			name: 'Фильм 4 c очень-очень длинным названием',
			score: '9',
			isAlreadyWatched: false,
		},
		{ id: '5', imgSrc: Poster, name: 'Фильм 5', score: '5.8', isAlreadyWatched: true },
		{ id: '6', imgSrc: Poster, name: 'Фильм 6', score: '5.8', isAlreadyWatched: false },
	];

	const data = {
		name: 'Советские фильмы',
		description:
			'Самые важные фильмы, снятые в СССР: авангардные шедевры Эйзенштейна, комедии Гайдая, экзистенциальные драмы Шепитько и многое другое',
	};

	let inputValue = $state('');

	const filteredMovies = $derived(
		movies.filter((movie) => movie.name.toLowerCase().includes(inputValue.toLowerCase())),
	);
</script>

<svelte:head>
	<title>Подборки фильмов</title>
</svelte:head>

<h1 class="title">{data.name}</h1>
<section class="suggest">
	<h2 class="visually-hidden">Блок с подборками фильмов от пользователей</h2>
	<p class="description">{data.description}</p>
	<div class="suggest__search">
		<Input label="Поиск подборок с фильмами" bind:value={inputValue}>
			{#snippet leftIcon()}
				<SearchIcon />
			{/snippet}
		</Input>
		<Button>Поиск</Button>
	</div>
	<p class="suggest__result">
		{filteredMovies.length}
		{getNoun(filteredMovies.length, 'Результат', 'Результата', 'Результатов')}
	</p>
	<ul class="cards">
		{#each filteredMovies as movie}
			<li class="cards__item">
				<Card id={movie.id} name={movie.name} imgSrc={movie.imgSrc} score={movie.score}>
					{#snippet bottomChildren()}
						{#if movie.isAlreadyWatched}
							<div class={'cards__item-text green-color'}>
								<VideoTickIcon />
								<p>Уже просмотрено</p>
							</div>
						{/if}
					{/snippet}
				</Card>
			</li>
		{/each}
	</ul>
</section>

<style>
	.title {
		margin-top: 80px;
		margin-bottom: 30px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.description {
		margin-bottom: 30px;
		color: var(--grey-50);
	}

	.suggest__search {
		display: flex;
		align-items: start;
		gap: 8px;
		width: 100%;
		max-width: 513px;
		color: var(--grey-600);
	}

	.suggest__search :global(.button) {
		width: auto;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, 290px);
		justify-content: center;
		gap: 16px 24px;
		margin: 50px auto;
		width: 100%;
	}

	.suggest__result {
		color: var(--grey-50);
		font: var(--type-link-regular);
	}

	.suggest__search :global(.button) {
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

	.cards__item {
		width: 100%;
	}

	.cards__item-text {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		margin-left: 8px;
		color: var(--primary-400);

		p {
			font: var(--type-link-regular);
		}
	}

	.green-color {
		color: var(--success-400);
	}

	@media (width <= 760px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.suggest__search {
			flex-direction: column;
			width: auto;
		}

		.suggest__search :global(.button) {
			width: 100%;
		}
	}
</style>
