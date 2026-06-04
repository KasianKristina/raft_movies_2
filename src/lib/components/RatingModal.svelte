<script lang="ts">
	import Modal from './Modal.svelte';
	import Star from '$lib/icons/Star.svelte';

	type Props = {
		isOpen: boolean;
		movieId: string;
		currentRating?: number | null;
		onRated: (userRating: number, movieRating: number) => void;
		onClose?: () => void;
	};

	let {
		isOpen = $bindable(false),
		movieId,
		currentRating = null,
		onRated,
		onClose,
	}: Props = $props();

	let hoveredStar = $state<number | null>(null);
	let selectedStar = $state<number | null | undefined>(currentRating);
	let isSaving = $state(false);
	let errorMessage = $state('');

	$effect(() => {
		if (isOpen) {
			selectedStar = currentRating;
			errorMessage = '';
		}
	});

	async function handleRate(starIndex: number) {
		if (isSaving) return;

		selectedStar = starIndex;
		isSaving = true;
		errorMessage = '';

		try {
			const response = await fetch(`/api/movies/${movieId}/rating`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ rating: starIndex }),
			});

			if (response.ok) {
				const result = await response.json();
				onRated(result.user_rating, result.movie_rating);
				isOpen = false;
			} else {
				errorMessage = 'Ошибка при сохранении оценки';
				selectedStar = currentRating;
			}
		} catch {
			errorMessage = 'Ошибка при сохранении оценки';
			selectedStar = currentRating;
		} finally {
			isSaving = false;
		}
	}

	function handleSkip() {
		isOpen = false;
		onClose?.();
	}
</script>

<Modal bind:open={isOpen}>
	<div class="rating-modal">
		<p class="rating-modal__title">Оцените фильм</p>
		<div class="rating-modal__stars">
			{#each Array.from({ length: 10 }, (_, i) => i + 1) as starIndex (starIndex)}
				{@const isInHoverRange = hoveredStar !== null && starIndex <= hoveredStar}
				{@const isInSelectedRange = selectedStar !== null && starIndex <= selectedStar}
				{@const isFilled = hoveredStar !== null ? isInHoverRange : isInSelectedRange}
				<button
					class="rating-modal__star"
					class:rating-modal__star--hovered={isInHoverRange}
					class:rating-modal__star--selected={!isInHoverRange && isInSelectedRange}
					type="button"
					disabled={isSaving}
					onmouseenter={() => (hoveredStar = starIndex)}
					onmouseleave={() => (hoveredStar = null)}
					onclick={() => handleRate(starIndex)}
				>
					<Star filled={isFilled} />
				</button>
			{/each}
		</div>
		<p class="rating-modal__score" class:rating-modal__score--empty={!hoveredStar && !selectedStar}>
			{#if hoveredStar}
				{hoveredStar} / 10
			{:else if selectedStar}
				{selectedStar} / 10
			{:else}
				Выберите оценку
			{/if}
		</p>
		{#if errorMessage}
			<p class="rating-modal__error">{errorMessage}</p>
		{/if}
		<button class="rating-modal__skip" type="button" onclick={handleSkip} disabled={isSaving}>
			Пропустить
		</button>
	</div>
</Modal>

<style>
	.rating-modal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
	}

	.rating-modal__title {
		color: var(--grey-100);
		font: var(--type-heading-four);
		text-align: center;
	}

	.rating-modal__stars {
		display: flex;
		gap: 8px;
		width: 100%;
	}

	.rating-modal__star {
		display: flex;
		flex: 1 1 0;
		justify-content: center;
		align-items: center;
		transition:
			transform 0.1s ease,
			opacity 0.15s ease;
		cursor: pointer;
		border: none;
		background: transparent;
		padding: 4px;
		color: var(--warning-500);

		:global(svg) {
			aspect-ratio: 1;
			width: min(100%, 32px);
			height: auto;
		}

		&:hover {
			transform: scale(1.2);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.rating-modal__star--hovered {
		opacity: 0.5;
	}

	.rating-modal__star--selected {
		opacity: 1;
	}

	.rating-modal__score {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 2rem;
		color: var(--grey-100);
		font: var(--type-heading-four);
	}

	.rating-modal__score--empty {
		color: var(--grey-500);
		font: var(--type-body-regular);
	}

	.rating-modal__error {
		color: var(--error-300);
		font: var(--type-body-regular);
	}

	.rating-modal__skip {
		cursor: pointer;
		border: none;
		background: transparent;
		color: var(--grey-500);
		font: var(--type-link-regular);
		text-decoration: underline;

		&:hover {
			color: var(--grey-300);
		}

		&:disabled {
			cursor: not-allowed;
		}
	}
</style>
