<script>
	import Button from '../../components/Button.svelte';
	import Input from '../../components/Input.svelte';
	import searchIcon from '$lib/images/search-normal.svg';
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
		<Input placeholder="Search Movies or TV Shows" leftIcon={searchIcon} />
		<Button onClick={() => {}}>Search</Button>
	</div>
</div>

<style>
	.header {
		width: 100%;
		font: var(--type-heading-two);
		color: var(--grey-50);
		text-align: left;
		margin-top: 80px;
	}

	.text {
		color: var(--grey-300);
		font: var(--type-body-regular);
		margin-top: 16px;
		margin-bottom: 24px;
	}

	.search-block {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 513px;
	}
</style>
