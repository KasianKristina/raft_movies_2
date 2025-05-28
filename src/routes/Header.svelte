<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/images/logo.svg';
</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="logo" />
		</a>
	</div>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/movies' ? 'page' : undefined}>
				<a href="/movies">Movies</a>
			</li>
			<li aria-current={page.url.pathname === '/suggestions' ? 'page' : undefined}>
				<a href="/suggestions">Suggestions</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
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
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		color: var(--grey-200);
		font: var(--type-link-regular);
		text-decoration: none;
		transition: color 0.2s linear;
		padding: 12px 16px;
	}

	a:hover {
		color: var(--grey-300);
	}
</style>
