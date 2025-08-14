<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SuggestionCard from '$lib/components/SuggestionCard.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import VideoPlayIcon from '$lib/icons/VideoPlayIcon.svelte';

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

	let showModal = $state(false);
</script>

<svelte:head>
	<title>Главная</title>
</svelte:head>

<h1 class="title">Добро пожаловать</h1>
<section class="welcome-section">
	<h2 class="visually-hidden">Папки с подборками фильмов</h2>
	<ul class="welcome-section__folders">
		{#each suggestions as suggestion}
			<li>
				<SuggestionCard {...suggestion} />
			</li>
		{/each}
	</ul>
</section>
<section class="quick-links">
	<h2 class="quick-links__title">Быстрые ссылки</h2>
	<div class="quick-links__list">
		<a href="/suggestions" class="quick-links__item">Подборки</a>
		<button class="quick-links__item" onclick={() => (showModal = true)}>Добавить</button>
	</div>
</section>

<Modal open={showModal} onClose={() => (showModal = false)}>
	<p class="modal__title">Новая подборка</p>
	<div class="inputs_wrapper">
		<Input label="Название">
			{#snippet leftIcon()}
				<VideoPlayIcon />
			{/snippet}
		</Input>
		<Textarea label="Описание" />
	</div>
	<Button onclick={() => (showModal = false)}>Создать</Button>
</Modal>

<style>
	.title {
		margin-top: 80px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.welcome-section__folders {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin-top: 40px;
		margin-bottom: 80px;
		width: 100%;
	}

	.welcome-section__folders {
		display: grid;
		grid-template-columns: repeat(auto-fill, 290px);
		justify-content: center;
		gap: 16px 24px;
		margin: 50px auto;
		width: 100%;
	}

	.quick-links__title {
		color: var(--grey-50);
		font: var(--type-heading-five);
		text-align: center;
	}

	.quick-links__list {
		display: flex;
		gap: 24px;
		margin-top: 40px;
	}

	.quick-links__item {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 12px;
		background-color: var(--grey-900);
		width: 100%;
		min-height: 104px;
		color: var(--primary-400);
		font: var(--type-link-regular);
		text-decoration: none;
	}

	.modal__title {
		margin-bottom: 40px;
		color: var(--grey-100);
		font: var(--type-heading-four);
		text-align: center;
	}

	.inputs_wrapper {
		color: var(--grey-600);
	}

	@media (width <= 768px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.welcome-section__folders {
			justify-content: center;
		}

		.quick-links__list {
			flex-direction: column;
		}
	}
</style>
