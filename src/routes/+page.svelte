<script lang="ts">
	const folders = [
		{ number: 93, text: 'Movies' },
		{ number: 93, text: 'Movies' },
		{ number: 93, text: 'Movies' },
		{ number: 93, text: 'Movies' },
	];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div>
	<section class="welcome-section">
		<h1 class="welcome-section__title">Welcome</h1>
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
		<h2 class="quick-links__title">Quick Links</h2>
		<ul class="quick-links__list">
			<li class="quick-links__item">Suggestions</li>
			<li class="quick-links__item">Add</li>
		</ul>
	</section>
</div>

<style>
	.welcome-section__title {
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		margin-top: 80px;
		text-align: left;
	}

	.welcome-section__folders {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		gap: 24px;
		margin-bottom: 80px;
		margin-top: 40px;
	}

	.folder {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 152px;
		background-color: var(--grey-900);
		border-radius: 12px;
		cursor: pointer;
		gap: 8.5px;
		max-width: 272px;
	}

	.folder__number {
		color: var(--grey-50);
		font: var(--type-heading-three);
	}

	.folder__text {
		color: var(--grey-400);
		font: var(--type-body-regular);
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
		width: 100%;
		height: 104px;
		color: var(--primary-400);
		font: var(--type-link-regular);
		background-color: var(--grey-900);
		border-radius: 12px;
		cursor: pointer;
	}

	@media (width <= 480px) {
		.welcome-section__title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.welcome-section__folders {
			justify-content: center;
		}
	}
</style>
