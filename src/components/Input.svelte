<script lang="ts">
	export let type: string = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let label: string = '';
	export let name: string = '';
	export let id: string = name;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let errorMessage: string = '';

	let isFocused: boolean = false;
	let hasValue: boolean = false;

	$: hasValue = Boolean(value);

	const handleFocus = () => (isFocused = true);
	const handleBlur = () => (isFocused = false);
</script>

<div class="input-wrapper">
	<div class="input-container" class:error={errorMessage}>
		{#if label}
			<label for={id} class="floating-label" class:active={isFocused || hasValue}>
				{label}
			</label>
		{/if}

		<input
			{type}
			{name}
			{id}
			{required}
			{disabled}
			bind:value
			on:focus={handleFocus}
			on:blur={handleBlur}
			class="input"
			class:input-with-label={Boolean(label)}
			class:input-error={Boolean(errorMessage)}
			placeholder={!label ? placeholder : null}
			{...$$restProps}
		/>
	</div>

	{#if errorMessage}
		<div class="error-message">{errorMessage}</div>
	{/if}
</div>

<style>
	.input-wrapper {
		margin: 1rem 0;
		width: 100%;
		position: relative;
	}

	.input-container {
		position: relative;
	}

	.input {
		width: 100%;
		padding: 16px 12px;
		border: 1px solid var(--grey-600);
		color: var(--white-400);
		font: var(--type-body-regular);
		border-radius: 12px;
		transition: border-color 0.3s ease;

		&:focus {
			outline: none;
			border-color: var(--tertary-500);
			color: white;
		}

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}
	}

	.input-with-label {
		padding-top: 26px;
		padding-bottom: 12px;
	}

	.floating-label {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		font: var(--type-caption);
		color: var(--grey-600);
		pointer-events: none;
		transition: all 0.2s ease-out;

		&.active {
			top: 12px;
			transform: translateY(0);
		}
	}

	.error-message {
		color: var(--error-500);
		margin-top: 12px;
		font: var(--type-caption);
	}

	.error,
	.input-error {
		border-color: var(--error-500) !important;
	}
</style>
