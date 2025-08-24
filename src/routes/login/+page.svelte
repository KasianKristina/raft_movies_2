<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schemas/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';

	let { data } = $props<{ data: PageData }>();

	const { form, errors, enhance } = superForm(data.form, {
		validators: zod(loginSchema),
	});
</script>

<svelte:head>
	<title>Авторизация</title>
</svelte:head>

<AuthForm
	title="Авторизация"
	buttonText="Авторизоваться"
	switcherText="Еще не зарегистрировались?"
	switcherHref="/registration"
	{form}
	{errors}
	{enhance}
/>
