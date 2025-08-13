<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
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
	<h2 class="visually-hidden">Постер к фильму</h2>
	<div class="header-section__image_wrapper">
		<img
			src={data.image_url}
			alt={`постер к фильму ${data.name}`}
			width={1200}
			height={480}
			class="header-section__image"
		/>
	</div>
	<div class="header-section__name-wrapper">
		<Breadcrumbs
			breadcrumbs={[
				{ text: 'suggestions', link: '/suggestions' },
				{ text: 'Movie', link: '/movie/1' },
			]}
		/>
		<p>{data.name}</p>
	</div>
</section>
<section class="info-section">
	<h2 class="visually-hidden">О фильме</h2>
	<div class="info-section__wrapper">
		<img
			src={data.image_url}
			alt={`постер к фильму ${data.name}`}
			width={480}
			height={720}
			class="info-section__image"
		/>
		<div>
			<p class="info-section__description">{data.description}</p>
			<div class="info-section__score">
				<Score score={data.score} />
			</div>
			<ul class="info-section__details">
				<li class="info-section__detail">
					<p class="info-section__detail-key">Жанр</p>
					<p class="info-section__detail-value">{data.genres.join(', ')}</p>
				</li>
				<li class="info-section__detail">
					<p class="info-section__detail-key">Год производства</p>
					<p class="info-section__detail-value">{data.year_of_production}</p>
				</li>
				<li class="info-section__detail">
					<p class="info-section__detail-key">Страна</p>
					<p class="info-section__detail-value">{data.country}</p>
				</li>
				<li class="info-section__detail">
					<p class="info-section__detail-key">Режиссер</p>
					<p class="info-section__detail-value">{data.film_director}</p>
				</li>
				<li class="info-section__detail">
					<p class="info-section__detail-key">Время</p>
					<p class="info-section__detail-value">{data.time}</p>
				</li>
			</ul>
		</div>
	</div>
</section>

<style>
	.header-section {
		margin-top: 40px;
	}

	.header-section__image_wrapper {
		position: relative;
		width: 100%;
		height: 480px;
		overflow: hidden;
	}

	.header-section__image {
		display: block;
		border-radius: 40px;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.header-section__name-wrapper {
		display: flex;
		position: absolute;
		bottom: 92px;
		left: 174px;
		flex-direction: column;
		gap: 8px;
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border-radius: 24px;
		background: var(--black-200);
		padding: 40px;
		width: 560px;

		p {
			color: var(--grey-50);
			font: var(--type-heading-three);
		}
	}

	.info-section__wrapper {
		display: flex;
		align-items: center;
		gap: 70px;
		margin-top: 152px;
		margin-left: 70px;
	}

	.info-section__description {
		color: var(--grey-300);
		font: var(--type-body-large);
	}

	.info-section__detail {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.info-section__detail-key {
		color: var(--grey-400);
		font: var(--type-body-regular);
		overflow-wrap: break-word;
	}

	.info-section__detail-value {
		min-width: 0;
		color: var(--grey-100);
		font: var(--type-body-large);
	}

	.info-section__details {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 24px;
		width: 100%;
	}

	.info-section__score {
		margin: 24px 0;
		width: fit-content;
	}

	.info-section {
		margin-bottom: 160px;
	}

	.info-section__image {
		aspect-ratio: 2/3;
		width: 100%;
		max-width: 300px;
		height: auto;
		max-height: 621px;
		object-fit: cover;
	}

	@media (width <= 1080px) {
		.info-section__wrapper {
			flex-direction: column;
			margin-top: 0;
			margin-left: 0;
		}

		.header-section__name-wrapper {
			display: flex;
			position: relative;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			padding: 20px;
			width: 100%;
		}

		.header-section__image_wrapper {
			display: none;
		}
	}

	@media (width <= 480px) {
		.info-section__details {
			grid-template-columns: 1fr;
		}

		.info-section__detail {
			width: 100%;
		}

		.info-section__description {
			font: var(--type-body-regular);
		}
	}
</style>
