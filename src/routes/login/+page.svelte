<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import EmailIcon from '$lib/icons/Email.svelte';
	import PasswordIcon from '$lib/icons/PasswordKey.svelte';
	import EyeCloseIcon from '$lib/icons/EyeClose.svelte';
	import EyeOpenIcon from '$lib/icons/EyeOpen.svelte';
	import LoginHumanImg from '$lib/images/loginImage.avif';
	import { isValidEmail } from '$lib/utils/validation';

	type FormType = 'auth' | 'registration';

	let hidePassword = $state(true);
	let formType: FormType = $state('auth');
	let inputEmailValue = $state('');
	let emailTouched = $state(false);
	let passwordTouched = $state(false);
	let inputPasswordValue = $state('');

	const toggleVisibility = () => {
		hidePassword = !hidePassword;
	};

	const toggleFormType = () => {
		formType = formType === 'auth' ? 'registration' : 'auth';
	};

	const handleSubmit = () => {
		if (!inputEmailValue || !inputPasswordValue || !isValidEmail(inputEmailValue)) {
			emailTouched = true;
			passwordTouched = true;
			return;
		}
	};

	const getErrorMessage = () => {
		if (emailTouched)
			if (!inputEmailValue) {
				return 'Введите email';
			} else {
				return !isValidEmail(inputEmailValue) ? 'Некорректная почта' : '';
			}
	};
</script>

<svelte:head>
	<title>Авторизаиця / регистрация</title>
</svelte:head>

<h1 class="visually-hidden">Авторизаиця / регистрация</h1>
<div class="page__container">
	<img src={LoginHumanImg} alt="" width={486} height={560} class="human-img" />
	<section class="auth-form">
		<h2 class="auth-form__title">{formType === 'auth' ? 'Авторизация' : 'Регистрация'}</h2>
		<div class="auth-form__inputs-wrapper">
			<Input
				label="Почта"
				bind:value={inputEmailValue}
				onblur={() => (emailTouched = true)}
				onfocus={() => (emailTouched = false)}
				errorMessage={getErrorMessage()}
				required
			>
				{#snippet leftIcon()}
					<EmailIcon />
				{/snippet}
			</Input>
			<Input
				label="Пароль"
				type={hidePassword ? 'password' : 'text'}
				autocomplete="current-password"
				bind:value={inputPasswordValue}
				onblur={() => (passwordTouched = true)}
				onfocus={() => (passwordTouched = false)}
				errorMessage={!inputPasswordValue && passwordTouched ? 'Введите пароль' : ''}
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
		</div>

		<Button onclick={handleSubmit}
			>{formType === 'auth' ? 'Авторизоваться' : 'Зарегистрироваться'}</Button
		>

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

	.auth-form__inputs-wrapper {
		display: flex;
		flex-direction: column;
		gap: 20px;
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

	@media (width <= 768px) {
		.auth-form__title {
			font: var(--type-heading-three);
			text-align: center;
		}
	}
</style>
