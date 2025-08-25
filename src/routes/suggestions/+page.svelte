<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SuggestionCard from '$lib/components/SuggestionCard.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import type { SuggestionInterface } from '$lib/types/types';
	import { getNoun } from '$lib/utils/formatNames';
	import { searchByWords } from '$lib/utils/search';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let inputValue = $state('');

	const filteredSuggestions = $derived(
		searchByWords(data.suggestions as SuggestionInterface[], inputValue),
	);
</script>

<svelte:head>
	<title>Подборки фильмов</title>
</svelte:head>

<h1 class="title">Подборки фильмов</h1>
<section class="suggest">
	<h2 class="visually-hidden">Блок с подборками фильмов от пользователей</h2>
	<div class="suggest__search">
		<Input label="Поиск подборок с фильмами" bind:value={inputValue}>
			{#snippet leftIcon()}
				<SearchIcon />
			{/snippet}
		</Input>
		<Button>Поиск</Button>
	</div>
	<p class="suggest__result">
		{filteredSuggestions.length}
		{getNoun(filteredSuggestions.length, 'Результат', 'Результата', 'Результатов')}
	</p>
	<ul class="cards">
		{#each filteredSuggestions as suggestion}
			<li>
				<SuggestionCard {...suggestion} />
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

	@media (width <= 768px) {
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

		.suggest__result {
			padding-top: 25px;
		}
	}
</style>
