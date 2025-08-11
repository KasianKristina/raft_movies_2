<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';

	type Props = {
		open: boolean;
		onClose: () => void;
		closeOnOverlayClick?: boolean;
		closeOnEsc?: boolean;
		children: Snippet;
	};

	let { open, onClose, closeOnOverlayClick = true, closeOnEsc = true, children }: Props = $props();

	const handleKeyDown = (e: KeyboardEvent) => {
		if (closeOnEsc && e.key === 'Escape') {
			onClose();
		}
	};

	const handleOverlayClick = (e: MouseEvent) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleOverlayKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			const mouseEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
			e.currentTarget?.dispatchEvent(mouseEvent);
		}
	};

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeyDown);
		} else {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	});
</script>

{#if open}
	<div
		class="modal__overlay"
		onclick={handleOverlayClick}
		onkeydown={handleOverlayKeyDown}
		tabindex="0"
		role="button"
		aria-label="Close modal by clicking outside"
	>
		<div class="modal__content" role="dialog" tabindex="-1">
			<button class="modal__close-btn" onclick={onClose} aria-label="Close modal">
				<CloseIcon />
			</button>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.modal__overlay {
		display: flex;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
		background-color: rgba(0, 0, 0, 0.5);
	}

	.modal__content {
		display: flex;
		position: relative;
		flex-direction: column;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		border-radius: 8px;
		background: var(--black-600);
		padding: 80px;
		width: 90%;
		max-width: 600px;
		max-height: 90vh;
		overflow: hidden;
	}

	.modal__close-btn {
		display: flex;
		position: absolute;
		top: 24px;
		right: 24px;
		justify-content: center;
		align-items: center;
		transition: color 0.2s;
		border-radius: 8px;
		background-color: transparent;
		width: 40px;
		height: 40px;
		color: white;

		&:hover {
			background-color: var(--black-30);
		}
	}

	@media (max-width: 640px) {
		.modal__content {
			width: 95%;
		}
	}
</style>
