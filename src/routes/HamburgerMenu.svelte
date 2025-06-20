<script lang="ts">
	import LogoIcon from '$lib/icons/Logo.svelte';
	import ArrowIcon from '$lib/icons/ArrowRight.svelte';

	let showMenu: boolean = false;

	function toggleNavbar(): void {
		showMenu = !showMenu;
	}
</script>

<nav class="nav">
	<div class="nav-header">
		<a href="/" class="logo">
			<LogoIcon size={32} colorFirst="#1EA5FC" colorSecond="#7B6EF6" />
		</a>
		<button type="button" on:click={toggleNavbar}>
			<LogoIcon size={160} colorFirst="#1EA5FC" colorSecond="#7B6EF6" />
			<ArrowIcon size={24} color="#8E95A9" />
		</button>
	</div>
	<ul class="nav-menu {showMenu ? 'show' : ''}">
		<li><a class="nav-link" href="/">Home</a></li>
		<li><a class="nav-link" href="/movies">Movies</a></li>
		<li><a class="nav-link" href="/suggestions">Suggestions</a></li>
	</ul>
</nav>

<style>
	.nav {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		padding: 15px;
		background-color: var(--grey-900);
	}

	.nav-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-menu {
		display: none;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
	}

	.nav-menu.show {
		display: flex;
	}

	@media (width >= 768px) {
		.nav-menu {
			display: flex;
			flex-direction: row;
			gap: 2.5rem;
			margin-top: 0;
		}
	}

	.nav-link {
		color: var(--grey-200);
		font: var(--type-link-regular);
		text-decoration: none;
	}

	.nav-link:active {
		color: var(--grey-300);
	}

	@media (hover: hover) {
		.nav-link:hover {
			color: var(--grey-300);
		}
	}
</style>
