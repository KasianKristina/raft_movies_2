<script lang="ts">
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';

	let {
		isOpen = $bindable(false),
		itemName = '',
		itemType = 'элемент',
		onConfirm,
		onCancel,
		title = 'Подтверждение удаления',
		confirmText = 'Удалить',
		cancelText = 'Отмена',
		isDeleting = false,
	} = $props();

	const handleCancel = () => {
		onCancel?.();
		isOpen = false;
	};
</script>

<Modal bind:open={isOpen}>
	<div class="delete__confirmation">
		<h3 class="delete__title">{title}</h3>

		<p class="delete__message">
			{#if itemName}
				Вы уверены, что хотите удалить {itemType} «<strong>{itemName}</strong>»?
			{:else}
				Вы уверены, что хотите удалить этот {itemType}?
			{/if}
		</p>

		<p class="delete__message-warning">Это действие невозможно будет отменить</p>

		<div class="delete__actions">
			<Button onclick={handleCancel} disabled={isDeleting}>
				{cancelText}
			</Button>

			<Button onclick={() => onConfirm?.()} disabled={isDeleting}>
				{#if isDeleting}
					Удаление...
				{:else}
					{confirmText}
				{/if}
			</Button>
		</div>
	</div>
</Modal>

<style>
	.delete__confirmation {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.delete__title {
		margin-bottom: 40px;
		color: var(--grey-100);
		font: var(--type-heading-four);
		text-align: center;
	}

	.delete__message {
		color: var(--grey-200);
	}

	.delete__message-warning {
		color: var(--error-500);
	}

	.delete__actions {
		display: flex;
		justify-content: space-evenly;
		margin-top: 30px;

		:global(.button):first-child {
			background-color: var(--success-500);
		}

		:global(.button):last-child {
			background-color: var(--error-500);
		}
	}
</style>
