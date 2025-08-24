<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { registrationSchema } from '$lib/schemas/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import Input from '$lib/components/Input.svelte';
	import StarIcon from '$lib/icons/Star.svelte';

	let { data } = $props<{ data: PageData }>();

	const { form, errors, enhance } = superForm(data.form, {
		validators: zod(registrationSchema),
		onUpdated({ form }) {
			if (form.data.email === '') {
				form.errors.email = [];
			}
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
	{errors}
	{enhance}
>
	<Input
		label="Имя"
		type="string"
		name="name"
		bind:value={$form.name}
		errorMessage={$errors.name?.[0] as string}
		required
	>
		{#snippet leftIcon()}
			<StarIcon />
		{/snippet}
	</Input>
	<Input
		label="Фамилия"
		type="string"
		name="surname"
		bind:value={$form.surname}
		errorMessage={$errors.surname?.[0] as string}
		required
	>
		{#snippet leftIcon()}
			<StarIcon />
		{/snippet}
	</Input>
</AuthForm>
