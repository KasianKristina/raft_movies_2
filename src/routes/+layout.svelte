<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import HamburgerMenu from './HamburgerMenu.svelte';

	let { children } = $props();
</script>

<div class="app">
	<div class="desktop-header">
		<Header />
	</div>
	<div class="mobile-header">
		<HamburgerMenu />
	</div>
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 120px;
		background: var(--grey-900) url('$lib/images/background.png') no-repeat center / cover;
	}

	main {
		width: 100%;
		box-sizing: border-box;
	}

	.desktop-header {
		display: block;
	}
	.mobile-header {
		display: none;
	}

	@media (max-width: 480px) {
		.app {
			padding: 20px;
		}
		.desktop-header {
			display: none;
		}
		.mobile-header {
			display: block;
		}
	}
</style>
