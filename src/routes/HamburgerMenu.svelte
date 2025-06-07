<script lang="ts">
	import logo from '$lib/icons/logo.svg';
	import arrow from '$lib/icons/arrow-right.svg';

	let showMenu: boolean = false;

	function toggleNavbar(): void {
		showMenu = !showMenu;
	}
</script>

<nav class="nav">
	<div class="nav-header">
		<a href="/" class="logo">
			<img src={logo} alt="logo" />
		</a>
		<button type="button" on:click={toggleNavbar}>
			<img src={arrow} alt="menu button" />
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

	.logo img {
		width: 32px;
		height: 32px;
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

	.nav-link:hover {
		color: var(--grey-300);
	}
</style>
