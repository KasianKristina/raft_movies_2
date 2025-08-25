<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import VideoTickIcon from '$lib/icons/VideoTick.svelte';
	import { searchByWords } from '$lib/utils/search';
	import type { MovieCardInterface } from '$lib/types/types';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let inputValue = $state('');

	const filteredMovies = $derived(searchByWords(data.movies as MovieCardInterface[], inputValue));
</script>

<svelte:head>
	<title>{`Подборка фильмов ${data.suggestion.name}`}</title>
</svelte:head>

<h1 class="title">{data.name}</h1>
<section>
	<h2 class="visually-hidden">Блок с подборками фильмов от пользователей</h2>
	<p class="suggestion__description">{data.suggestion.description}</p>
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
		{#each filteredMovies as movie}
			<li class="cards__item">
				<MovieCard id={movie.id} name={movie.name} imgSrc={movie.imgSrc} score={movie.score}>
					{#snippet bottomChildren()}
						{#if movie.isAlreadyWatched}
							<div class="cards__item-text">
								<VideoTickIcon />
								<p>Уже просмотрено</p>
							</div>
						{/if}
					{/snippet}
				</MovieCard>
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

	.suggestion__result_cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, 290px);
		justify-content: center;
		gap: 16px 24px;
		margin: 50px auto;
		width: 100%;
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

	.cards__item {
		width: 100%;
	}

	.cards__item-text {
		display: flex;
		position: absolute;
		bottom: 0;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		margin-left: 8px;
		color: var(--success-400);

		p {
			font: var(--type-link-regular);
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
	}
</style>
