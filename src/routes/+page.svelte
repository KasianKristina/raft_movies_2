<script lang="ts">
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1 class="welcome">Welcome</h1>

	<ul class="folders">
		<li class="folder">
			<p class="number">93</p>
			<p class="text">Movies</p>
		</li>
		<li class="folder">
			<p class="number">93</p>
			<p class="text">Movies</p>
		</li>
		<li class="folder">
			<p class="number">93</p>
			<p class="text">Movies</p>
		</li>
		<li class="folder">
			<p class="number">93</p>
			<p class="text">Movies</p>
		</li>
	</ul>

	<h2 class="quickLinks">Quick Links</h2>
	<ul class="quickLinksWrapper">
		<li class="quickLink">Suggestions</li>
		<li class="quickLink">Add</li>
	</ul>
</section>

<style>
	.welcome {
		width: 100%;
		font: var(--type-heading-two);
		color: var(--grey-50);
		text-align: left;
		margin-top: 80px;
	}

	.folders {
		display: flex;
		gap: 24px;
		margin-top: 40px;
		margin-bottom: 80px;
		width: 100%;
	}

	.folder {
		width: 100%;
		height: 152px;
		background-color: var(--grey-900);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 8.5px;
		cursor: pointer;
	}

	.number {
		color: var(--grey-50);
		font: var(--type-heading-three);
	}

	.text {
		color: var(--grey-400);
		font: var(--type-body-regular);
	}

	.quickLinks {
		font: var(--type-heading-five);
		color: var(--grey-50);
		text-align: center;
	}

	.quickLinksWrapper {
		display: flex;
		gap: 24px;
		margin-top: 40px;
	}

	.quickLink {
		background-color: var(--grey-900);
		width: 100%;
		border-radius: 12px;
		height: 104px;
		color: var(--primary-400);
		font: var(--type-link-regular);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>
