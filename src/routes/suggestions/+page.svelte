<script>
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
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
</section>

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
