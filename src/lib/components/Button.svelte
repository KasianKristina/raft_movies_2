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
		transition: background-color 0.3s ease;
		cursor: pointer;
		border: 2px solid transparent;
		border-radius: 12px;
		background-color: var(--primary-400);
		padding: 16px 32px;
		height: fit-content;
		color: white;
		font: var(--type-body-regular);

		&:disabled {
			opacity: 0.4;
			pointer-events: none;
		}
	}

	@media (hover: hover) {
		.button {
			&:hover {
				background-color: var(--primary-500);
			}

			&:active {
				border-color: var(--primary-500);
				background-color: var(--primary-400);
			}
		}
	}
</style>
