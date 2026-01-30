<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import AuthForm from '$lib/components/AuthForm.svelte';

	let { data }: { data: PageData } = $props();

	const { form, errors, enhance, message } = superForm(data.form);
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
	{message}
	{enhance}
/>
