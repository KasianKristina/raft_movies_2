<script>
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import Poster from '$lib/images/poster.png';

	const movies = [
		{ id: '1', imgSrc: Poster, name: 'Фильм 1', score: '8.1' },
		{ id: '2', imgSrc: Poster, name: 'Фильм 2', score: '5.8' },
		{ id: '3', name: 'Фильм 3', score: '4.4' },
		{ id: '4', imgSrc: Poster, name: 'Фильм 4 c очень-очень длинным названием', score: '9' },
		{ id: '5', imgSrc: Poster, name: 'Фильм 5', score: '5.8' },
		{ id: '6', imgSrc: Poster, name: 'Фильм 6', score: '5.8' },
	];
</script>

<svelte:head>
	<title>Название подборки</title>
</svelte:head>

<h1 class="title">Название подборки</h1>
<div class="text-column">
	<h2 class="visually-hidden">Поиск фильмов и телешоу</h2>
	<Input label="Поиск фильмов или телешоу">
		{#snippet leftIcon()}
			<SearchIcon />
		{/snippet}
	</Input>

	<ul class="cards">
		{#each movies as movie}
			<li class="cards__item">
				<Card id={movie.id} name={movie.name} imgSrc={movie.imgSrc} score={movie.score} />
			</li>
		{/each}
	</ul>
</div>

<style>
	.title {
		margin-top: 80px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
		justify-content: center;
		gap: 16px 24px;
		width: 100%;
	}

	.cards__item {
		width: 100%;
	}

	@media (width <= 760px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}
	}
</style>
