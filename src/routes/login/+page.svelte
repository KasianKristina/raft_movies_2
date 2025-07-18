<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import EmailIcon from '$lib/icons/Email.svelte';
	import PasswordIcon from '$lib/icons/PasswordKey.svelte';
	import EyeCloseIcon from '$lib/icons/EyeClose.svelte';
	import EyeOpenIcon from '$lib/icons/EyeOpen.svelte';
	import LoginHumanImg from '$lib/images/loginImage.avif';

	type FormType = 'auth' | 'registration';

	let hidePassword = true;
	let formType: FormType = 'auth';

	const toggleVisibility = () => {
		hidePassword = !hidePassword;
	};

	const toggleFormType = () => {
		formType = formType === 'auth' ? 'registration' : 'auth';
	};
</script>

<svelte:head>
	<title>Авторизаиця / регистрация</title>
</svelte:head>

<h1 class="visually-hidden">Авторизаиця / регистрация</h1>
<div class="page__container">
	<img
		src={LoginHumanImg}
		alt="3D-модель мужчины в мультяшном стиле"
		width={486}
		height={560}
		class="human-img"
	/>
	<section class="auth-form">
		<h2 class="auth-form__title">{formType === 'auth' ? 'Авторизация' : 'Регистрация'}</h2>
		<Input label="Почта" required>
			{#snippet leftIcon()}
				<EmailIcon />
			{/snippet}
		</Input>
		<Input
			label="Пароль"
			type={hidePassword ? 'password' : 'text'}
			autocomplete="current-password"
			required
		>
			{#snippet leftIcon()}
				<PasswordIcon />
			{/snippet}
			{#snippet rightIcon()}
				<button
					onclick={toggleVisibility}
					aria-label={hidePassword ? 'Скрыть пароль' : 'Показать пароль'}
				>
					{#if hidePassword}
						<EyeCloseIcon />
					{:else}
						<EyeOpenIcon />
					{/if}
				</button>
			{/snippet}
		</Input>

		<Button>{formType === 'auth' ? 'Авторизоваться' : 'Зарегистрироваться'}</Button>

		<div class="auth-form__switcher">
			<p>
				{formType === 'auth' ? 'Еще не зарегистрировались?' : 'Уже зарегистрированы?'}
			</p>
			<button onclick={toggleFormType}>
				<span class="auth-form__switcher-label"
					>{formType === 'auth' ? 'Регистрация' : 'Авторизация'}</span
				>
			</button>
		</div>
	</section>
</div>

<style>
	.page__container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 40px;
	}

	.auth-form {
		max-width: 486px;
		color: var(--grey-600);

		button {
			height: 24px;
			color: var(--grey-600);
		}
	}

	.auth-form :global(.button) {
		margin-top: 15px;
		margin-bottom: 20px;
		width: 100%;
	}

	.auth-form__title {
		margin-bottom: 40px;
		color: var(--grey-100);
		font: var(--type-heading-one);
	}

	.auth-form__switcher-label {
		color: var(--primary-300);
		text-decoration: underline;
	}

	.auth-form__switcher {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.human-img {
		max-width: 100%;
		height: auto;
	}

	@media (width <= 1080px) {
		.human-img {
			display: none;
		}
	}

	@media (width <= 525px) {
		.auth-form__title {
			font-size: 30px;
		}

		.auth-form__switcher {
			flex-direction: column;
		}
	}
</style>
