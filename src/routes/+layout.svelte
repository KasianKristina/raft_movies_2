<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Raft movies app" />
</svelte:head>

<Header />
<main>
	{@render children()}
</main>

<style>
	:global(#app) {
		display: flex;
		flex-direction: column;
		background: var(--grey-900) url('$lib/images/background.webp') no-repeat center / cover;
		min-height: 100vh;
	}

	main {
		box-sizing: border-box;
		padding: 0 6em;
		width: 100%;
	}

	@media (width <= 480px) {
		main {
			padding: 15px 40px;
		}
	}
</style>
