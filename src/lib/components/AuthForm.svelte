<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import EmailIcon from '$lib/icons/Email.svelte';
	import PasswordIcon from '$lib/icons/PasswordKey.svelte';
	import EyeCloseIcon from '$lib/icons/EyeClose.svelte';
	import EyeOpenIcon from '$lib/icons/EyeOpen.svelte';
	import LoginHumanImg from '$lib/images/loginImage.avif';
	import type { LoginSchema, RegistrationSchema } from '$lib/schemas/auth';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import type { Snippet } from 'svelte';

	let { title, buttonText, switcherText, switcherHref, form, errors, enhance, children } = $props<{
		title: string;
		buttonText: string;
		switcherText: string;
		switcherHref: string;
		form: SuperFormData<LoginSchema | RegistrationSchema>;
		errors: SuperFormErrors<LoginSchema | RegistrationSchema>;
		enhance: (form: HTMLFormElement) => void;
		children?: Snippet;
	}>();

	let hidePassword = $state(true);

	const toggleVisibility = () => {
		hidePassword = !hidePassword;
	};
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="page__container">
	<img src={LoginHumanImg} alt="" width={486} height={560} class="human-img" />
	<div>
		<h1 class="auth-form__title">{title}</h1>
		<form class="auth-form" method="POST" use:enhance>
			<div class="auth-form__inputs-wrapper">
				<Input
					label="Почта"
					type="email"
					name="email"
					bind:value={$form.email}
					errorMessage={$errors.email?.[0] as string}
					required
				>
					{#snippet leftIcon()}
						<EmailIcon />
					{/snippet}
				</Input>
				<Input
					label="Пароль"
					name="password"
					type={hidePassword ? 'password' : 'text'}
					autocomplete="current-password"
					bind:value={$form.password}
					errorMessage={$errors.password?.[0] as string}
					required
				>
					{#snippet leftIcon()}
						<PasswordIcon />
					{/snippet}
					{#snippet rightIcon()}
						<button
							type="button"
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
				{#if children}
					{@render children()}
				{/if}
			</div>

			<Button type="submit">{buttonText}</Button>
		</form>
		<div class="auth-form__switcher">
			<p class="auth-form__switcher-text">{switcherText}</p>
			<a href={switcherHref} class="auth-form__switcher-label">Перейти</a>
		</div>
	</div>
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

	.auth-form__switcher-text {
		color: var(--grey-600);
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
