<script>
	import Button from '../../components/Button.svelte';
	import Input from '../../components/Input.svelte';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<h1 class="header">Suggest me</h1>
	<p>I will really appreciate it if you take time to suggest me something good to watch</p>
	<div class="search-block">
		<Input />
		<Button>Search</Button>
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

	.search-block {
	}
</style>
