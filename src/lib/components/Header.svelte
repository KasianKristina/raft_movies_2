<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { COLORS } from '$lib/colors/colors';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import LogoIcon from '$lib/icons/Logo.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';

	const menuItems = [
		{ pathName: '/', pageName: 'Главная' },
		{ pathName: '/movies', pageName: 'Фильмы' },
		{ pathName: '/suggestions', pageName: 'Предложения' },
	];

	let showMenu: boolean = false;

	function toggleNavbar(): void {
		showMenu = !showMenu;
	}

	$: if (browser) {
		if (showMenu) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
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
		position: sticky;
		top: 0;
		display: flex;
		justify-content: space-between;
		padding: 16px 6em;
		background-color: var(--primary-900);
		z-index: 1;
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

	.header__menu-link--current {
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
		.header {
			padding: 16px 40px;
		}

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
			top: 80px;
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
