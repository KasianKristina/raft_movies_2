<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import Input from '$lib/components/Input.svelte';
	import StarIcon from '$lib/icons/Star.svelte';

	let { data } = $props<{ data: PageData }>();

	const { form, errors, enhance } = superForm(data.form);
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
	{errors}
	{enhance}
>
	<Input
		label="Имя"
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
		label="Фамилия"
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
</AuthForm>
