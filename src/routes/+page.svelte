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

<section>
	<h1 class="welcome">Welcome</h1>

	<ul class="folders">
		{#each folders as folder}
			<li class="folder">
				<p class="number">{folder.number}</p>
				<p class="text">{folder.text}</p>
			</li>
		{/each}
	</ul>

	<h2 class="quick-links">Quick Links</h2>
	<ul class="quick-links-wrapper">
		<li class="quick-link">Suggestions</li>
		<li class="quick-link">Add</li>
	</ul>
</section>

<style>
	.welcome {
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		margin-top: 80px;
		text-align: left;
	}

	.folders {
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

	.number {
		color: var(--grey-50);
		font: var(--type-heading-three);
	}

	.text {
		color: var(--grey-400);
		font: var(--type-body-regular);
	}

	.quick-links {
		color: var(--grey-50);
		font: var(--type-heading-five);
		text-align: center;
	}

	.quick-links-wrapper {
		display: flex;
		gap: 24px;
		margin-top: 40px;
	}

	.quick-link {
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
		.welcome {
			font: var(--type-heading-three);
			text-align: center;
		}

		.folders {
			justify-content: center;
		}
	}
</style>
