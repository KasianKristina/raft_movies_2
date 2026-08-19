<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schemas/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';

	let { data }: { data: PageData } = $props();

	const { form, errors, enhance, message } = superForm(data.form, {
		validators: zodClient(loginSchema),
	});
</script>

<svelte:head>
	<title>Авторизация</title>
</svelte:head>

<AuthForm
	title="Авторизация"
	buttonText="Авторизоваться"
	switcherText="Еще не зарегистрировались?"
	switcherHref={resolve('/registration')}
	{form}
	{errors}
	{message}
	{enhance}
/>
