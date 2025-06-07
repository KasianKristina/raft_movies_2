<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/icons/logo.svg';
</script>

<header class="header">
	<div class="corner">
		<a href="/">
			<img src={logo} alt="logo" />
		</a>
	</div>

	<nav class="nav">
		<ul class="ul">
			<li class="li" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li class="li" aria-current={page.url.pathname === '/movies' ? 'page' : undefined}>
				<a href="/movies">Movies</a>
			</li>
			<li class="li" aria-current={page.url.pathname === '/suggestions' ? 'page' : undefined}>
				<a href="/suggestions">Suggestions</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		padding: 16px 0;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	.nav {
		display: flex;
		justify-content: center;
	}

	.ul {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 3em;
		margin: 0;
		padding: 0;
		background: var(--background);
		background-size: contain;
		gap: 16px;
		list-style: none;
	}

	.li {
		position: relative;
		height: 100%;
	}

	.li a {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 12px 16px;
		color: var(--grey-200);
		font: var(--type-link-regular);
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--grey-300);
	}
</style>
