<script lang="ts">
	import { page } from '$app/state';
	import { COLORS } from '$lib/colors/colors';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import LogoIcon from '$lib/icons/Logo.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';

	let showMenu: boolean = false;

	function toggleNavbar(): void {
		showMenu = !showMenu;
	}
</script>

<header class="header">
	<div class="header__logo-container">
		<a href="/">
			<LogoIcon size={32} colorFirst={COLORS.SECONDARY_500} colorSecond={COLORS.PRIMARY_400} />
		</a>
		<button type="button" onclick={toggleNavbar} class="header__toggle">
			{#if showMenu}
				<CloseIcon color={COLORS.GREY_300} size={30} />
			{:else}
				<MenuIcon color={COLORS.GREY_300} />
			{/if}
		</button>
	</div>

	<nav class="header__nav" class:header__mobile={showMenu}>
		<ul class="header__menu-list">
			<li class="header__menu-item" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a
					class="header__menu-link"
					href="/"
					onclick={toggleNavbar}
					class:header__menu-item--current={page.url.pathname === '/'}>Home</a
				>
			</li>
			<li
				class="header__menu-item"
				aria-current={page.url.pathname === '/movies' ? 'page' : undefined}
			>
				<a
					class="header__menu-link"
					href="/movies"
					onclick={toggleNavbar}
					class:header__menu-item--current={page.url.pathname === '/movies'}>Movies</a
				>
			</li>
			<li
				class="header__menu-item"
				aria-current={page.url.pathname === '/suggestions' ? 'page' : undefined}
			>
				<a
					class="header__menu-link"
					href="/suggestions"
					onclick={toggleNavbar}
					class:header__menu-item--current={page.url.pathname === '/suggestions'}>Suggestions</a
				>
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

	.header__logo-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 3em;
	}

	.header__nav {
		display: flex;
		justify-content: center;
		z-index: 1;
	}

	.header__menu-list {
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

	.header__menu-item {
		position: relative;
		height: 100%;
	}

	.header__menu-link {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 12px 16px;
		color: var(--grey-200);
		font: var(--type-link-regular);
		text-decoration: none;
		transition: color 0.2s linear;
	}

	.header__menu-item--current {
		color: var(--primary-400);
	}

	.header__toggle {
		display: none;
	}

	@media (hover: hover) {
		.header__menu-link:hover {
			color: var(--grey-300);
		}
	}

	@media (width <= 480px) {
		.header__toggle {
			display: block;
		}

		.header__menu-list {
			flex-direction: column;
		}

		.header__nav {
			display: none;
		}

		.header__mobile {
			display: block;
		}

		.header__mobile .header__menu-list {
			position: absolute;
			top: 85px;
			left: 0;
			width: 100%;
			height: fit-content;
			background-color: var(--primary-900);
		}

		.header__logo-container {
			position: relative;
		}

		.header__menu-item {
			height: 65px;
		}

		.header__menu-link {
			font-size: 20px;
		}
	}
</style>
