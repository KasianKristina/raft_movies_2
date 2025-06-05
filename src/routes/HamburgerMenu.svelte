<script lang="ts">
	import logo from '$lib/images/logo.svg';
	import arrow from '$lib/images/arrow-right.svg';

	let showMenu: boolean = false;

	function toggleNavbar(): void {
		showMenu = !showMenu;
	}
</script>

<div>
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
</div>

<style>
	.nav {
		padding: 2rem 1.5rem;
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;

	}

	.nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	@media (min-width: 768px) {
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
