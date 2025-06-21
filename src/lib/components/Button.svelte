<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		onClick,
		disabled = false,
	} = $props<{
		children: Snippet<[]>;
		onClick?: () => void;
		disabled?: boolean;
	}>();

	const isDisabled = $derived(disabled);

	function handleClick(e: MouseEvent) {
		onClick?.();
		(e.currentTarget as HTMLButtonElement).blur();
	}
</script>

<button type="button" class="button" onclick={handleClick} disabled={isDisabled}>
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

		&:active {
			background-color: var(--primary-400);
			border-color: var(--primary-500);
		}

		&:disabled {
			opacity: 0.4;
			pointer-events: none;
		}
	}

	@media (hover: hover) {
		.button:hover {
			background-color: var(--primary-500);
		}
	}
</style>
