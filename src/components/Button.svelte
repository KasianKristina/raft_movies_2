<script lang="ts">
	import type { Snippet } from 'svelte';

	export let children: Snippet;
	export let onClick: () => void | undefined;
	export let disabled: boolean = false;
	export let className: string = '';
</script>

<button type="button" class={`button ${className}`} onclick={onClick} {disabled}>
	{@render children()}
</button>

<style>
	.button {
		padding: 16px 32px;
		color: white;
		background-color: var(--primary-400);
		font: var(--type-body-regular);
		border-radius: 12px;
		border: 2px solid transparent;
		transition: background-color 0.3s ease;
		cursor: pointer;
		height: fit-content;

		&:hover {
			background-color: var(--primary-500);
		}

		&:active,
		&:focus {
			background-color: var(--primary-400);
			border-color: var(--primary-500);
		}

		&:disabled {
			opacity: 0.4;
			pointer-events: none;
		}
	}
</style>
