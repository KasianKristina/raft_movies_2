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
	export let leftIcon: string = '';
	export let rightIcon: string = '';
	export let onLeftIconClick: () => void = () => {};
	export let onRightIconClick: () => void = () => {};

	let isFocused: boolean = false;
	let hasValue: boolean = false;

	$: hasValue = Boolean(value);

	const handleFocus = () => (isFocused = true);
	const handleBlur = () => (isFocused = false);
</script>

<div class="input-wrapper">
	<div class="input-container">
		{#if label}
			<label for={id} class="floating-label" class:active={isFocused || hasValue}>
				{label}
			</label>
		{/if}

		<div class="input" class:input-active={isFocused} class:input-error={Boolean(errorMessage)}>
			{#if leftIcon}
				<button class:disabled on:click={onLeftIconClick} class="button">
					<img src={leftIcon} alt="" />
				</button>
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
				class="input-component"
				class:input-with-label={Boolean(label)}
				placeholder={!label ? placeholder : null}
				{...$$restProps}
			/>

			{#if rightIcon}
				<button class:disabled on:click={onRightIconClick} class="button">
					<img src={rightIcon} alt="" />
				</button>
			{/if}
		</div>
	</div>

	{#if errorMessage}
		<div class="error-message">{errorMessage}</div>
	{/if}
</div>

<style>
	.input-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 25px;
	}

	.input {
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

	.input-component {
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

	.input-active {
		border-color: var(--tertiary-500);
	}

	.input-with-label {
		padding-bottom: 12px;
		padding-top: 26px;
	}

	.input-error {
		border-color: var(--error-500);
	}

	.floating-label {
		position: absolute;
		top: 50%;
		left: 12px;
		color: var(--grey-600);
		font: var(--type-caption);
		pointer-events: none;
		transform: translateY(-50%);
		transition: all 0.2s ease-out;

		&.active {
			top: 12px;
			transform: translateY(0);
		}
	}

	.error-message {
		position: absolute;
		color: var(--error-500);
		font: var(--type-caption);
		margin-top: 12px;
	}

	::placeholder {
		color: var(--grey-500);
		font: var(--type-caption);
	}

	.button {
		display: flex;
		justify-content: center;
		align-self: center;
	}
</style>
