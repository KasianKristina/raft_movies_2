<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registrationSchema } from '$lib/schemas/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import Input from '$lib/components/Input.svelte';
	import StarIcon from '$lib/icons/Star.svelte';
	import PasswordIcon from '$lib/icons/PasswordKey.svelte';
	import EyeCloseIcon from '$lib/icons/EyeClose.svelte';
	import EyeOpenIcon from '$lib/icons/EyeOpen.svelte';

	let { data }: { data: PageData } = $props();

	let hidePassword = $state(true);

	const toggleVisibility = () => {
		hidePassword = !hidePassword;
	};

	const { form, errors, enhance, message } = superForm(data.form, {
		validators: zodClient(registrationSchema),
		validationMethod: 'onblur',
		onChange: (event) => {
			const target = event.target as HTMLInputElement | null;
			const name = target?.name;

			if (!name) return;

			errors.update((e) => {
				const next = { ...e };
				delete next[name as keyof typeof next];
				return next;
			});
		},
	});
</script>

<svelte:head>
	<title>Регистрация</title>
</svelte:head>

<AuthForm
	title="Регистрация"
	buttonText="Зарегистрироваться"
	switcherText="Уже зарегистрированы?"
	switcherHref="/login"
	{form}
	{message}
	{errors}
	{enhance}
>
	<Input
		label="Повторите пароль *"
		type={hidePassword ? 'password' : 'text'}
		name="confirmPassword"
		bind:value={$form.confirmPassword}
		errorMessage={$errors.confirmPassword?.[0] as string}
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
				class="button__hide-password"
			>
				{#if hidePassword}
					<EyeCloseIcon />
				{:else}
					<EyeOpenIcon />
				{/if}
			</button>
		{/snippet}
	</Input>
	<Input
		label="Имя *"
		type="string"
		name="firstName"
		bind:value={$form.firstName}
		errorMessage={$errors.firstName?.[0] as string}
		required
	>
		{#snippet leftIcon()}
			<StarIcon />
		{/snippet}
	</Input>
	<Input
		label="Фамилия *"
		type="string"
		name="lastName"
		bind:value={$form.lastName}
		errorMessage={$errors.lastName?.[0] as string}
		required
	>
		{#snippet leftIcon()}
			<StarIcon />
		{/snippet}
	</Input>
	<p>* Обязательное поле</p>
</AuthForm>

<style>
	.button__hide-password {
		height: 24px;
		color: var(--grey-600);
	}
</style>
