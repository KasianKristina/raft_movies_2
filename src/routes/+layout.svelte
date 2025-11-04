<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	const { children, data } = $props();
</script>

<svelte:head>
	<meta name="description" content="Raft movies app" />
</svelte:head>

{#if data.user}
	<Header userName={`${data.user.first_name} ${data.user.last_name}`} />
{/if}
<main>
	{@render children()}
</main>

<style>
	main {
		box-sizing: border-box;
		padding: 0 6em;
		width: 100%;
	}

	@media (width <= 768px) {
		main {
			padding: 15px 40px;
		}
	}
</style>
