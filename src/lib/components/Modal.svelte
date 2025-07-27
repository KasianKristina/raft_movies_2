<!-- Modal.svelte -->
<script lang="ts">
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';

	type Props = {
		open: boolean;
		onClose: () => void;
		closeOnOverlayClick?: boolean;
		closeOnEsc?: boolean;
		children: Snippet;
	};

	let { open, onClose, closeOnOverlayClick, closeOnEsc, children }: Props = $props();

	// Генерация уникальных ID для доступности
	let modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;
	let titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;

	// Обработчики событий
	const handleKeyDown = (e) => {
		if (closeOnEsc && e.key === 'Escape') {
			onClose();
		}
	};

	const handleOverlayClick = (e) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	// Управление скроллом и событиями
	onMount(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeyDown);
		}
	});

	onDestroy(() => {
		document.body.style.overflow = '';
		window.removeEventListener('keydown', handleKeyDown);
	});

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
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="overlay"
		onclick={handleOverlayClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby={titleId}
		tabindex="-1"
	>
		<div class="modal" id={modalId}>
			<button class="close-btn" onclick={onClose}><CloseIcon /></button>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.overlay {
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

	.modal {
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

	.close-btn {
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
		.modal {
			width: 95%;
		}
		.content {
			padding: 16px;
		}
	}
</style>
