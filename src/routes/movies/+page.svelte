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
	import Poster from '$lib/images/poster.png';
	import AddIcon from '$lib/icons/Add.svg';

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

	const suggestions = [
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
	];

	let showModal = false;
	let showModalWithSuggestions = false;
</script>

<svelte:head>
	<title>Предложения</title>
</svelte:head>

<h1 class="title">Предложи фильм</h1>
<section class="suggest">
	<h2 class="visually-hidden">Блок с поиском фильмов или телепередач</h2>
	<p class="suggest__text">
		Я буду очень признателен, если вы найдете время и предложите мне что-нибудь интересное для
		просмотра
	</p>
	<div class="suggest__search">
		<Input label="Поиск фильмов или телешоу">
			{#snippet leftIcon()}
				<SearchIcon />
			{/snippet}
		</Input>
		<Button>Поиск</Button>
	</div>
	<ul class="cards">
		{#each movies as movie}
			<li class="cards__item">
				<MovieCard id={movie.id} name={movie.name} imgSrc={movie.imgSrc} score={movie.score}>
					{#snippet bottomChildren()}
						{#if movie.isAlreadyWatched}
							<div class={'cards__item-text green-color'}>
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
	<p class="suggest-manually__text">Не нашли то, что искали?</p>
	<Button onclick={() => (showModal = true)}>Предложить свой фильм</Button>
</section>

<Modal open={showModal} onClose={() => (showModal = false)}>
	<p class="modal__title">Предложи что-нибудь для просмотра</p>

	<div class="inputs_wrapper">
		<Input label="Название">
			{#snippet leftIcon()}
				<VideoPlayIcon />
			{/snippet}
		</Input>
		<Input label="Ссылка (если есть)">
			{#snippet leftIcon()}
				<LinkIcon />
			{/snippet}
		</Input>
	</div>

	<Button>Предложить</Button>
</Modal>

<Modal open={showModalWithSuggestions} onClose={() => (showModalWithSuggestions = false)}>
	<p class="modal__title">Добавить фильм в подборку</p>
	<select class="select">
		{#each suggestions as suggestion}
			<option>{suggestion.name}</option>
		{/each}
	</select>
	<Button onclick={() => (showModal = false)}>Добавить</Button>
</Modal>

<style>
	.title {
		margin-top: 80px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.suggest__text {
		margin-top: 16px;
		margin-bottom: 24px;
		color: var(--grey-300);
		font: var(--type-body-regular);
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
		margin-bottom: 16px;
		margin-left: 8px;
		color: var(--primary-400);

		p {
			font: var(--type-link-regular);
		}
	}

	.inputs_wrapper {
		color: var(--grey-600);
	}

	.green-color {
		color: var(--success-400);
	}

	.select {
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

	@media (width <= 760px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.suggest__search {
			flex-direction: column;
			width: auto;
		}

		.suggest__search :global(.button),
		.suggest-manually :global(.button) {
			width: 100%;
		}
	}
</style>
