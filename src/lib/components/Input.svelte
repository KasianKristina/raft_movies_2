<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		label?: string;
		errorMessage?: string;
		leftIcon?: () => any;
		rightIcon?: () => any;
		onValueChange?: (value: string) => void;
	};

	const {
		value = '',
		placeholder = '',
		label = '',
		id,
		errorMessage = '',
		leftIcon,
		rightIcon,
		onValueChange,
		...rest
	}: Props = $props();

	let localValue = $state(value);

	$effect(() => {
		localValue = value;
	});

	$effect(() => {
		onValueChange?.(localValue);
	});

	let isFocused = $state(false);

	const hasValue = $derived(Boolean(value));

	const handleFocus = () => (isFocused = true);
	const handleBlur = () => (isFocused = false);
</script>

<div class="input">
	<div class="input__container">
		{#if label}
			<label for={id} class="input__label" class:input__label--floating={isFocused || hasValue}>
				{label}
			</label>
		{/if}

		<div
			class="input__field"
			class:input__field--focused={isFocused}
			class:input__field--error={Boolean(errorMessage)}
		>
			{#if leftIcon}
				{@render leftIcon()}
			{/if}

			<input
				{id}
				bind:value={localValue}
				onfocus={handleFocus}
				onblur={handleBlur}
				class="input__control"
				placeholder={!label ? placeholder : null}
				{...rest}
			/>

			{#if rightIcon}
				{@render rightIcon()}
			{/if}
		</div>
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
		width: 100%;
		padding-bottom: 25px;
	}

	.input__field {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 16px 12px;
		border: 1px solid var(--grey-600);
		border-radius: 12px;
		gap: 16px;
		transition: border-color 0.3s ease;

		&:disabled {
			cursor: not-allowed;
			opacity: 0.7;
		}
	}

	.input__control {
		width: 100%;
		border: none;
		background: transparent;
		color: var(--white-400);
		font: var(--type-body-regular);

		&:focus {
			color: white;
			outline: none;
		}
	}

	.input__field--focused {
		border-color: var(--tertiary-500);
	}

	.input__field--error {
		border-color: var(--error-500);
	}

	.input__label {
		position: absolute;
		top: 50%;
		left: 12px;
		color: var(--grey-600);
		font: var(--type-caption);
		pointer-events: none;
		transform: translateY(-50%);
		transition: all 0.2s ease-out;

		&.input__label--floating {
			top: 12px;
			transform: translateY(0);
		}
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
