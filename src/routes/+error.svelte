<script lang="ts">
	import notFoundImage from '$lib/images/notFoundImage.avif';
</script>

<svelte:head>
	<title>Страница не найдена</title>
</svelte:head>

<div class="error-page">
	<h1 class="visually-hidden">Такая страница не найдена</h1>
	<img src={notFoundImage} alt="" class="error-page__image" width="400" height="320" />
	<section class="error-page__section">
		<h2 class="error-page__heading">Заблудились?</h2>
		<p class="error-page__description">Упс! Вы ищете что-то, чего на самом деле не существует</p>
		<a href="/" class="error-page__link">Вернуться на главную</a>
	</section>
</div>

<style>
	.error-page__image {
		width: 100%;
		max-width: 400px;
		height: auto;
	}

	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		width: 100%;
	}

	.error-page__heading {
		margin-bottom: 16px;
		color: var(--grey-50);
		font: var(--type-heading-two);
	}

	.error-page__description {
		margin-bottom: 36px;
		color: var(--grey-300);
		font: var(--type-body-regular);
	}

	.error-page__link {
		border-radius: 12px;
		background-color: var(--primary-400);
		padding: 16px 32px;
		color: white;
		text-decoration: none;
	}

	.error-page__section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (width <= 768px) {
		.error-page__heading {
			font: var(--type-heading-three);
		}
	}
</style>
