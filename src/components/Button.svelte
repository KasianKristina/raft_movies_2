<script lang="ts">
	import type { Snippet } from 'svelte';

	export let children: Snippet;
	export let onClick: () => void | undefined;
	export let disabled: boolean = false;
	export let className: string = '';

	function handleClick(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
	) {
		onClick();
		e.currentTarget.blur();
	}
</script>

<button type="button" class={`button ${className}`} on:click={handleClick} {disabled}>
	{@render children()}
</button>

<style>
	.button {
		height: fit-content;
		padding: 16px 32px;
		border: 2px solid transparent;
		color: white;
		font: var(--type-body-regular);
		background-color: var(--primary-400);
		border-radius: 12px;
		cursor: pointer;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: var(--primary-500);
		}

		&:active {
			background-color: var(--primary-400);
			border-color: var(--primary-500);
		}

		&:disabled {
			opacity: 0.4;
			pointer-events: none;
		}
	}
</style>
