<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		text?: string;
		disabled?: boolean;
		children: Snippet;
	};

	let { text = '', disabled = false, children }: Props = $props();
	let show = $state(false);
</script>

<div
	class="container"
	role="presentation"
	onmouseenter={() => (show = true)}
	onmouseleave={() => (show = false)}
	onfocusin={() => (show = true)}
	onfocusout={() => (show = false)}
>
	{@render children()}
	{#if show && !disabled}
		<div class="tooltip" transition:fade={{ duration: 150 }}>
			{text}
			<span class="tooltip__arrow"></span>
		</div>
	{/if}
</div>

<style>
	.container {
		position: relative;
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		border-radius: 8px;
		background-color: var(--black-200);
		padding: 6px 10px;
		width: max-content;
		max-width: 220px;
		pointer-events: none;
		color: var(--grey-100);
		font: var(--type-caption);
	}

	.tooltip__arrow {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--black-200);
	}
</style>
