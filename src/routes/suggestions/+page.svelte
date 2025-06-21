<script>
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { COLORS } from '$lib/colors/colors';
</script>

<svelte:head>
	<title>Suggestions</title>
</svelte:head>

<h1 class="title">Suggest me</h1>
<section class="suggest">
	<h2 class="visually-hidden">Block with search for movies or TV shows</h2>
	<p class="suggest__text">
		I will really appreciate it if you take time to suggest me something good to watch
	</p>
	<div class="suggest__search">
		<Input label="Search Movies or TV Shows">
			{#snippet leftIcon()}
				<SearchIcon size={21} color={COLORS.GREY_600} />
			{/snippet}
		</Input>
		<Button onClick={() => {}}>Search</Button>
	</div>
</section>

<style>
	.title {
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		margin-top: 80px;
		text-align: left;
	}

	.suggest__text {
		color: var(--grey-300);
		font: var(--type-body-regular);
		margin-bottom: 24px;
		margin-top: 16px;
	}

	.suggest__search {
		display: flex;
		align-items: start;
		width: 100%;
		gap: 8px;
		max-width: 513px;
	}

	/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
	.suggest__search :global(.button) {
		width: auto;
	}

	@media (width <= 480px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.suggest__search {
			flex-direction: column;
			width: auto;
		}

		/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
		.suggest__search :global(.button) {
			width: 100%;
		}
	}
</style>
