<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		text?: string;
		children: Snippet;
	};

	let { text = '', children }: Props = $props();
	let show = $state(false);
</script>

<button
	class="container"
	onmouseenter={() => {
		show = true;
	}}
	onmouseleave={() => {
		show = false;
	}}
>
	{@render children()}
	{#if show}
		<div class="tooltip">
			{text}
		</div>
	{/if}
</button>

<style>
	.container {
		position: relative;
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		margin-bottom: 8px;
		border-radius: 4px;
		background-color: black;
		padding: 8px 12px;
		min-width: 270px;
		color: white;
		font-size: 14px;
	}
</style>
