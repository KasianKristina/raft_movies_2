<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = HTMLTextareaAttributes & {
		label?: string;
		errorMessage?: string;
	};

	let {
		value = $bindable(),
		placeholder = '',
		label = '',
		id,
		errorMessage = '',
		...rest
	}: Props = $props();
</script>

<div class="textarea">
	<div class="textarea__field" class:textarea__field--error={Boolean(errorMessage)}>
		<textarea
			bind:value
			class="textarea__control"
			placeholder={!label ? placeholder : ''}
			{id}
			{...rest}
		></textarea>

		{#if label}
			<label for={id} class="textarea__label">
				{label}
			</label>
		{/if}
	</div>

	{#if errorMessage}
		<div class="textarea__error">
			<p class="textarea__error-text">{errorMessage}</p>
		</div>
	{/if}
</div>

<style>
	.textarea {
		position: relative;
		padding-bottom: 25px;
		width: 100%;
	}

	.textarea__field {
		display: flex;
		align-items: center;
		gap: 16px;
		transition: border-color 0.3s ease;
		border: 1px solid var(--grey-600);
		border-radius: 12px;
		padding: 16px 12px;
		width: 100%;

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}
	}

	.textarea__field:focus-within {
		border-color: var(--primary-400);
	}

	.textarea__field--error {
		border-color: var(--error-500);
	}

	.textarea__label {
		position: absolute;
		top: 28px;
		left: 12px;
		transform: translateY(-50%);
		transition: all 0.2s ease-out;
		pointer-events: none;
		color: var(--grey-600);
		font: var(--type-caption);
	}

	.textarea__control {
		border: none;
		background: transparent;
		width: 100%;
		min-height: 80px;
		color: var(--white-400);
		font: var(--type-body-regular);

		&:focus {
			outline: none;
			color: white;
		}
	}

	.textarea__control:focus ~ .textarea__label,
	.textarea__control:not(:placeholder-shown) ~ .textarea__label {
		top: 4px;
		transform: translateY(0);
	}

	.textarea__error {
		position: absolute;
		margin-top: 12px;
	}

	.textarea__error-text {
		color: var(--error-500);
		font: var(--type-caption);
	}

	::placeholder {
		color: var(--grey-500);
		font: var(--type-caption);
	}
</style>
