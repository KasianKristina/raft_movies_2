<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		onClick?: () => void;
		disabled?: boolean;
	}

	const { children, onClick, disabled = false }: Props = $props();
</script>

<button type="button" class="button" onclick={onClick} {disabled}>
	{@render children()}
</button>

<style>
	.button {
		padding: 16px 32px;
		color: var(--white);
		background-color: var(--primary-400);
		font: var(--type-body-regular);
		border-radius: 12px;
		border: 2px solid transparent;
		transition: background-color 0.3s ease;
		cursor: pointer;

		&:hover, &:focus {
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
