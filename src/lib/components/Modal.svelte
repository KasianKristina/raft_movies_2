<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';

	type Props = {
		open: boolean;
		children: Snippet;
	};

	let { open = $bindable(false), children }: Props = $props();

	const handleClose = () => {
		open = false;
	};

	const closeOnBackDropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	const handleCloseOnEsc = (e: KeyboardEvent) => {
		if (e.key === 'Escape') handleClose();
	};

	const toggleModal: Attachment<HTMLDialogElement> = (element) => {
		$effect(() => {
			if (open) {
				element.addEventListener('keydown', handleCloseOnEsc);
				element.addEventListener('click', closeOnBackDropClick);
				element.showModal();
			} else {
				element.close();
			}

			return () => {
				element.removeEventListener('keydown', handleCloseOnEsc);
				element.removeEventListener('click', closeOnBackDropClick);
			};
		});
	};
</script>

<dialog {@attach toggleModal} class="modal">
	<button class="modal__close-btn" onclick={handleClose} aria-label="Close modal">
		<CloseIcon />
	</button>
	{@render children()}
</dialog>

<style>
	.modal {
		position: relative;
		flex-direction: column;
		backdrop-filter: blur(5px);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		border-radius: 8px;
		background: var(--black-600);
		padding: 80px;
		width: 90%;
		max-width: 600px;
		max-height: 90vh;
		overflow: scroll-y;
	}

	.modal::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
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

	:global(body:has(dialog[open])) {
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.modal {
			padding: 20px;
			width: 95%;
		}

		.modal__close-btn {
			top: 5px;
			right: 5px;
		}
	}
</style>
