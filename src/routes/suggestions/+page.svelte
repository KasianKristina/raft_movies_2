<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { getNoun } from '$lib/utils/formatNames';

	const suggestions = [
		{
			id: '1',
			name: 'Подборка 1',
			description: 'Описание подборки 1',
			author: 'Иван Иванов',
			authorId: '1111',
			countAlreadyWatched: 0,
			countAll: 0,
		},
		{
			id: '2',
			name: 'Подборка с очень длинным названием',
			description: 'Длинное описание для подборки 2',
			author: 'Петр Петров',
			authorId: '1212',
			countAlreadyWatched: 1,
			countAll: 5,
		},
		{
			id: '3',
			name: 'Советские фильмы',
			description:
				'Самые важные фильмы, снятые в СССР: авангардные шедевры Эйзенштейна, комедии Гайдая, экзистенциальные драмы Шепитько и многое другое',
			author: 'Касьян Кристина',
			authorId: '1313',
			countAlreadyWatched: 1,
			countAll: 10,
		},
		{
			id: '4',
			name: '100 великих фильмов XXI века',
			description: '',
			author: 'Касьян Кристина',
			authorId: '1313',
			countAlreadyWatched: 3,
			countAll: 12,
		},
		{
			id: '5',
			name: 'Фильмы про космос',
			description: 'Cписок лучших фильмов про космические путешествия',
			author: 'Иван Иванов',
			authorId: '1111',
			countAlreadyWatched: 0,
			countAll: 7,
		},
	];

	let inputValue = $state('');

	const filteredSuggestions = $derived(
		suggestions.filter((suggestion) =>
			suggestion.name.toLowerCase().includes(inputValue.toLowerCase()),
		),
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
			<li class="cards__item">
				<a href={`/suggestion/${suggestion.id}`}>
					<p class="item__name" title={suggestion.name}>{suggestion.name}</p>
					<p class="item__count">
						{`Просмотрено ${suggestion.countAlreadyWatched} из ${suggestion.countAll}`}
					</p>
					<p class="item__description" title={suggestion.description}>{suggestion.description}</p>
					<p class="item__author">Автор: {suggestion.author}</p>
				</a>
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

	.cards__item {
		cursor: pointer;
		border-radius: 12px;
		background-color: var(--black-100);
		padding: 16px;
		width: 100%;
		text-decoration: none;
		a {
			text-decoration: none;
		}
	}

	.item__name {
		margin-bottom: 20px;
		height: 48px;
		font: var(--type-link-regular);
		-webkit-line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		color: var(--grey-50);
		text-decoration: none;
	}

	.item__description {
		font: var(--type-body-regular);
		-webkit-line-clamp: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		margin-bottom: 15px;
		height: 77px;
		overflow: hidden;
		color: var(--grey-50);
	}

	.item__count {
		margin-bottom: 15px;
		color: var(--grey-400);
		font: var(--type-caption);
	}

	.item__author {
		color: var(--primary-400);
		font: var(--type-body-extra-small);
	}

	.suggest__result {
		color: var(--grey-50);
		font: var(--type-link-regular);
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
