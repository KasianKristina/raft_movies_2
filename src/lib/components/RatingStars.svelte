<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Star from '$lib/icons/Star.svelte';
	import type { RateMovieResultType } from '$lib/types/types';

	type Props = {
		movieId: string;
		currentRating?: number | null;
		onRated: (userRating: number, movieRating: number) => void;
		onSkip: () => void;
		onClose: () => void;
	};

	let { movieId, currentRating = null, onRated, onSkip, onClose }: Props = $props();

	let hoveredStar = $state<number | null>(null);
	let isSaving = $state(false);

	const isRateMovieResult = (data: Record<string, unknown>): data is RateMovieResultType => {
		return typeof data.userRating === 'number' && typeof data.movieRating === 'number';
	};
</script>

<form
	class="rating-modal"
	method="POST"
	action="?/rateMovie"
	use:enhance={({ cancel }) => {
		if (isSaving) {
			cancel();
			return;
		}

		isSaving = true;

		return async ({ result }) => {
			isSaving = false;

			if (result.type === 'success' && result.data && isRateMovieResult(result.data)) {
				onRated(result.data.userRating, result.data.movieRating);
				onClose();
			} else {
				toast.error('Ошибка при сохранении оценки');
			}
		};
	}}
>
	<p class="rating-modal__title">Оцените фильм</p>
	<input type="hidden" name="movie_id" value={movieId} />
	<div
		class="rating-modal__stars"
		role="presentation"
		onmouseleave={() => (hoveredStar = null)}
		onfocusout={(event) => {
			const nextFocused = event.relatedTarget;
			if (!(nextFocused instanceof Node) || !event.currentTarget.contains(nextFocused)) {
				hoveredStar = null;
			}
		}}
	>
		{#each Array.from({ length: 10 }, (_, i) => i + 1) as starIndex (starIndex)}
			{@const isInHoverRange = hoveredStar !== null && starIndex <= hoveredStar}
			{@const isInSelectedRange = currentRating !== null && starIndex <= currentRating}
			{@const isFilled = hoveredStar !== null ? isInHoverRange : isInSelectedRange}
			<button
				class="rating-modal__star"
				class:rating-modal__star--hovered={isInHoverRange}
				class:rating-modal__star--selected={!isInHoverRange && isInSelectedRange}
				type="submit"
				name="rating"
				value={starIndex}
				disabled={isSaving}
				aria-label={`Оценка ${starIndex} из 10`}
				onmouseenter={() => (hoveredStar = starIndex)}
				onfocus={() => (hoveredStar = starIndex)}
			>
				<Star filled={isFilled} />
			</button>
		{/each}
	</div>
	<p class="rating-modal__score" class:rating-modal__score--empty={!hoveredStar && !currentRating}>
		{#if hoveredStar}
			{hoveredStar} / 10
		{:else if currentRating}
			{currentRating} / 10
		{:else}
			Выберите оценку
		{/if}
	</p>
	<button class="rating-modal__skip" type="button" onclick={onSkip} disabled={isSaving}>
		Пропустить
	</button>
</form>

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
