<!-- HamburgerMenu.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	export let open = false;

	// Закрытие меню при клике вне области
	function handleClickOutside(event) {
		if (open && !event.target.closest('.menu-container, .hamburger')) {
			open = false;
		}
	}

	// Закрытие при нажатии Escape
	function handleKeyDown(event) {
		if (open && event.key === 'Escape') {
			open = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
		document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<div class="hamburger {open ? 'open' : ''}" on:click={() => (open = !open)}>
	<div class="hamburger-line"></div>
	<div class="hamburger-line"></div>
	<div class="hamburger-line"></div>
</div>

<div class="menu-container">
	<ul class="menu-links">
		<li class="menu-link"><a href="/">Главная</a></li>
		<li class="menu-link"><a href="/about">О нас</a></li>
		<li class="menu-link"><a href="/services">Услуги</a></li>
		<li class="menu-link"><a href="/contact">Контакты</a></li>
	</ul>
</div>

<div class="overlay" on:click={() => (open = false)} />

<style>
	/* Кнопка гамбургера */
	.hamburger {
		position: relative;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 2rem;
		height: 2rem;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.hamburger-line {
		width: 2rem;
		height: 0.25rem;
		background: #333;
		border-radius: 10px;
		transition: all 0.3s ease;
		transform-origin: left;
	}

	.open .hamburger-line:first-child {
		transform: rotate(45deg) translate(0.35rem, -0.1rem);
	}

	.open .hamburger-line:nth-child(2) {
		opacity: 0;
	}

	.open .hamburger-line:last-child {
		transform: rotate(-45deg) translate(0.35rem, 0.1rem);
	}

	/* Меню */
	.menu-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		height: 100vh;
		background: white;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
		transform: translateX(-100%);
		transition: transform 0.3s ease;
		z-index: 90;
		padding: 5rem 1rem 1rem;
	}

	.open .menu-container {
		transform: translateX(0);
	}

	/* Оверлей */
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.3s ease;
		z-index: 80;
	}

	.open .overlay {
		opacity: 1;
		visibility: visible;
	}

	/* Ссылки меню */
	.menu-links {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.menu-link {
		padding: 1rem;
		border-bottom: 1px solid #eee;
		transition: background 0.2s;
	}

	.menu-link:hover {
		background: #f5f5f5;
	}

	.menu-link a {
		text-decoration: none;
		color: #333;
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
