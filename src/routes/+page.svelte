<script lang="ts">
	const folders = [
		{ number: 93, text: 'Фильма' },
		{ number: 91, text: 'Фильм' },
		{ number: 90, text: 'Фильмов' },
		{ number: 93, text: 'Фильма' },
	];
</script>

<svelte:head>
	<title>Главная</title>
</svelte:head>

<h1 class="title">Добро пожаловать</h1>
<section class="welcome-section">
	<h2 class="visually-hidden">Папки с подборками фильмов</h2>
	<ul class="welcome-section__folders">
		{#each folders as folder}
			<li class="folder">
				<p class="folder__number">{folder.number}</p>
				<p class="folder__text">{folder.text}</p>
			</li>
		{/each}
	</ul>
</section>
<section class="quick-links">
	<h2 class="quick-links__title">Быстрые ссылки</h2>
	<ul class="quick-links__list">
		<li class="quick-links__item">Предложения</li>
		<li class="quick-links__item">Добавить</li>
	</ul>
</section>

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

	.folder {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8.5px;
		cursor: pointer;
		border-radius: 12px;
		background-color: var(--grey-900);
		padding: 40px 20px;
		width: 282px;
	}

	.folder__number {
		color: var(--grey-50);
		font: var(--type-heading-three);
	}

	.folder__text {
		width: 100%;
		overflow: hidden;
		color: var(--grey-400);
		font: var(--type-body-regular);
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
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
	}

	@media (width <= 480px) {
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
