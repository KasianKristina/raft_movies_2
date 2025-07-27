<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	export let message: string;
	export let type: 'success' | 'error' | 'info' = 'info';
	export let duration: number = 3000;

	// Автоматическое закрытие
	let visible = false;

	setTimeout(() => (visible = true), 10);
	if (duration > 0) {
		setTimeout(() => (visible = false), duration);
	}

	function close() {
		visible = false;
	}
</script>

{#if visible}
	<div
		transition:fly={{ y: 20, duration: 200 }}
		class="toast"
		class:success={type === 'success'}
		class:error={type === 'error'}
	>
		<div class="content">
			<slot>{message}</slot>
		</div>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		right: 20px;
		bottom: 20px;
		z-index: 1000;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border-radius: 8px;
		background: #333;
		padding: 16px 24px;
		max-width: 320px;
		color: white;
	}

	.success {
		background: #4caf50;
	}

	.error {
		background: #f44336;
	}

	.content {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
