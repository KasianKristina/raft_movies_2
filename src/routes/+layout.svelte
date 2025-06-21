<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Raft movies app" />
</svelte:head>

<div class="app">
	<Header />
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		padding: 0 6em;
		background: var(--grey-900) url('$lib/images/background.png') no-repeat center / cover;
		min-height: 100vh;
	}

	main {
		width: 100%;
		box-sizing: border-box;
	}

	@media (width <= 480px) {
		.app {
			padding: 15px 40px;
		}
	}
</style>
