<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	const {
		children,
		data,
	}: {
		children: Snippet;
		data: PageData;
	} = $props();
</script>

<svelte:head>
	<meta name="description" content="Raft movies app" />
</svelte:head>

{#if data.user}
	<Header userName={`${data.user.first_name} ${data.user.last_name}`} />
{/if}
<main>
	{@render children()}
</main>
<Toaster position="top-right" richColors />

<style>
	main {
		box-sizing: border-box;
		padding: 0 6em;
		width: 100%;
	}

	@media (width <= 768px) {
		main {
			padding: 15px 40px;
		}
	}
</style>
