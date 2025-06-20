<script>
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { COLORS } from '$lib/colors/colors';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<h1 class="header">Suggest me</h1>
	<p class="text">
		I will really appreciate it if you take time to suggest me something good to watch
	</p>
	<div class="search-block">
		<Input placeholder="Search Movies or TV Shows">
			{#snippet leftIcon()}
				<SearchIcon size={21} color={COLORS.GREY_600} />
			{/snippet}
		</Input>
		<Button onClick={() => {}} className="text-btn">Search</Button>
		<Button onClick={() => {}} className="icon-btn">
			<SearchIcon color={COLORS.GREY_600} />
		</Button>
	</div>
</div>

<style>
	.header {
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		margin-top: 80px;
		text-align: left;
	}

	.text {
		color: var(--grey-300);
		font: var(--type-body-regular);
		margin-bottom: 24px;
		margin-top: 16px;
	}

	.search-block {
		display: flex;
		align-items: start;
		width: 513px;
		gap: 8px;
	}

	@media (width <= 480px) {
		.header {
			font: var(--type-heading-three);
			text-align: center;
		}

		.search-block {
			width: 100%;
		}
	}
</style>
