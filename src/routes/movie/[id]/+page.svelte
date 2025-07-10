<script lang="ts">
	import Score from '$lib/components/Score.svelte';
	import Poster from '$lib/images/poster.png';

	const data = {
		name: 'Lost in space',
		description:
			'The mission to save Scarecrow takes an unexpected turn, throwing the Resolute into chaos. Judy hatches a plan to get a ship to Alpha Centauri.',
		score: '8.1',
		genres: ['Приключения', 'Фантастика'],
		number_of_seasons: 1,
		year_of_production: 2006,
		country: 'Россия',
		film_director: 'Мамору Хосода',
		time: 1234567,
		image_url: Poster,
	};
</script>

<svelte:head>
	<title>О фильме</title>
</svelte:head>

<h1 class="visually-hidden">Информация о фильме {data.name}</h1>
<section class="header-section">
	<div class="header-section_wrapper">
		<img
			src={data.image_url}
			alt={`постер к фильму ${data.name}`}
			width={1200}
			height={480}
			class="header-section_image"
		/>
	</div>
	<div class="name__wrapper">
		<p>{data.name}</p>
	</div>
</section>
<section class="info-section">
	<h2 class="visually-hidden">О фильме</h2>
	<div class="wrapper">
		<img
			src={data.image_url}
			alt={`постер к фильму ${data.name}`}
			width={480}
			height={720}
			class="card__image"
		/>
		<div class="right-column">
			<p class="description">{data.description}</p>
			<div class="score-wrapper">
				<Score score={data.score} />
			</div>
			<div class="class">
				<div class="key-value-wrapper">
					<p class="key">Жанр</p>
					<p class="value">{data.genres.join(', ')}</p>
				</div>
				<div class="key-value-wrapper">
					<p class="key">Год производства</p>
					<p class="value">{data.year_of_production}</p>
				</div>
				<div class="key-value-wrapper">
					<p class="key">Страна</p>
					<p class="value">{data.country}</p>
				</div>
				<div class="key-value-wrapper">
					<p class="key">Режиссер</p>
					<p class="value">{data.film_director}</p>
				</div>
				<div class="key-value-wrapper">
					<p class="key">Время</p>
					<p class="value">{data.time}</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.header-section {
		margin-top: 40px;
	}

	.header-section_wrapper {
		position: relative;
		width: 100%;
		height: 480px;
		overflow: hidden;
	}

	.header-section_image {
		display: block;
		border-radius: 40px;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.name__wrapper {
		position: absolute;
		bottom: 92px;
		left: 174px;
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		background: var(--black-200);
		width: 560px;
		height: 144px;

		p {
			padding: 40px;
			color: var(--grey-50);
			font: var(--type-heading-three);
		}
	}

	.wrapper {
		display: flex;
		gap: 70px;
		margin-top: 152px;
		margin-left: 70px;
	}

	.description {
		color: var(--grey-300);
		font: var(--type-body-large);
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin-right: 80px;
		width: 480px;
	}

	.key-value-wrapper {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.key {
		color: var(--grey-400);
		font: var(--type-body-regular);
	}

	.value {
		color: var(--grey-100);
		font: var(--type-body-large);
	}

	.class {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	.score-wrapper {
		width: fit-content;
	}

	.info-section {
		margin-bottom: 160px;
	}

	.card__image {
		aspect-ratio: 2/3;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	@media (width <= 760px) {
		.wrapper {
			flex-direction: column;
			margin-left: 0;
		}

		.name__wrapper {
			display: flex;
			left: 0;
			left: 50%;
			align-items: center;
			transform: translateX(-50%);
		}
	}
</style>
