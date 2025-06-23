<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import LogoIcon from '$lib/icons/Logo.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';

	const menuItems = [
		{ pathName: '/', pageName: 'Главная' },
		{ pathName: '/movies', pageName: 'Фильмы' },
		{ pathName: '/suggestions', pageName: 'Предложения' },
	];

	let showMenu: boolean = false;
	let size: number;

	function toggleNavbar(): void {
		showMenu = !showMenu;
	}

	$: if (browser && size <= 768) {
		if (showMenu) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
</script>

<svelte:window bind:innerWidth={size} />
<header class="header">
	<div class="header__logo-container">
		<a href="/">
			<LogoIcon />
		</a>
		<button type="button" onclick={toggleNavbar} class="header__toggle">
			{#if showMenu}
				<CloseIcon />
			{:else}
				<MenuIcon />
			{/if}
		</button>
	</div>

	<nav class="header__nav" class:header__mobile={showMenu}>
		<ul class="header__menu-list">
			{#each menuItems as menuItem}
				<li
					class="header__menu-item"
					aria-current={page.url.pathname === menuItem.pathName ? 'page' : undefined}
				>
					<a
						class="header__menu-link"
						href={menuItem.pathName}
						onclick={toggleNavbar}
						class:header__menu-link--current={page.url.pathname === menuItem.pathName}
						>{menuItem.pageName}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.header {
		display: flex;
		position: sticky;
		top: 0;
		justify-content: space-between;
		z-index: 1;
		background-color: var(--primary-900);
		padding: 16px 6em;
	}

	.header__logo-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.header__nav {
		display: flex;
		justify-content: center;
	}

	.header__menu-list {
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		gap: 16px;
		margin: 0;
		background: var(--background);
		background-size: contain;
		padding: 0;
		list-style: none;
	}

	.header__menu-item {
		position: relative;
		height: 100%;
	}

	.header__menu-link {
		display: flex;
		align-items: center;
		transition: color 0.2s linear;
		padding: 12px 16px;
		height: 100%;
		color: var(--grey-200);
		font: var(--type-link-regular);
		text-decoration: none;
	}

	.header__menu-link--current {
		color: var(--primary-400);
	}

	.header__toggle {
		display: none;
	}

	.header__toggle :global(svg) {
		width: 30px;
		height: 30px;
	}

	@media (hover: hover) {
		.header__menu-link:hover {
			color: var(--grey-300);
		}
	}

	@media (width <= 768px) {
		.header {
			padding: 16px 40px;
		}

		.header__toggle {
			display: block;
			color: var(--grey-300);
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
			top: 68px;
			left: 0;
			background-color: var(--primary-900);
			width: 100%;
			height: fit-content;
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
