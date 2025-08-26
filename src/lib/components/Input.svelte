<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		label?: string;
		errorMessage?: string;
		leftIcon?: Snippet;
		rightIcon?: Snippet;
	};

	let {
		value = $bindable(),
		placeholder = '',
		label = '',
		id,
		errorMessage = '',
		leftIcon,
		rightIcon,
		...rest
	}: Props = $props();
</script>

<div class="input">
	<div class="input__field" class:input__field--error={Boolean(errorMessage)}>
		{#if leftIcon}
			{@render leftIcon()}
		{/if}

		<input
			bind:value
			class="input__control"
			placeholder={!label ? placeholder : ''}
			{id}
			{...rest}
		/>

		{#if label}
			<label for={id} class="input__label">
				{label}
			</label>
		{/if}

		{#if rightIcon}
			{@render rightIcon()}
		{/if}
	</div>

	{#if errorMessage}
		<div class="input__error">
			<p class="input__error-text">{errorMessage}</p>
		</div>
	{/if}
</div>

<style>
	.input {
		position: relative;
		padding-bottom: 25px;
		width: 100%;
	}

	.input__field {
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

	.input__control {
		border: none;
		background: transparent;
		width: 100%;
		color: var(--white-400);
		font: var(--type-body-regular);

		&:focus {
			outline: none;
			color: white;
		}

		&:-webkit-autofill,
		&:-webkit-autofill:hover,
		&:-webkit-autofill:focus,
		&:-webkit-autofill:active {
			-webkit-background-clip: text;
			-webkit-text-fill-color: var(--white-400);
		}

		&:autofill {
			background-color: transparent !important;
			color: var(--white-400) !important;
		}

		&:invalid {
			box-shadow: none;
		}

		&:-webkit-autofill:focus {
			-webkit-background-clip: text;
			-webkit-text-fill-color: var(--white-400);
		}

		&:user-invalid {
			box-shadow: none;
		}
	}

	.input__field:focus-within {
		border-color: var(--primary-400);
	}

	.input__field--error {
		border-color: var(--error-500);
	}

	.input__label {
		position: absolute;
		top: 28px;
		left: 48px;
		transform: translateY(-50%);
		transition: all 0.2s ease-out;
		pointer-events: none;
		color: var(--grey-600);
		font: var(--type-caption);
	}

	.input__control:focus ~ .input__label,
	.input__control:not(:placeholder-shown) ~ .input__label {
		top: 4px;
		transform: translateY(0);
	}

	.input__error {
		position: absolute;
		margin-top: 12px;
	}

	.input__error-text {
		color: var(--error-500);
		font: var(--type-caption);
	}

	::placeholder {
		color: var(--grey-500);
		font: var(--type-caption);
	}
</style>
