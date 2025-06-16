<script>
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
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
		<Input placeholder="Search Movies or TV Shows" leftIcon={SearchIcon} />
		<Button onClick={() => {}} className="text-btn">Search</Button>
		<Button onClick={() => {}} className="icon-btn">
			<SearchIcon color="#475069" />
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
