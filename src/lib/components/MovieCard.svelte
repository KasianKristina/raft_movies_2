<script lang="ts">
	import type { Snippet } from 'svelte';
	import Score from './Score.svelte';
	import Tooltip from './Tooltip.svelte';
	import NoPhotoImage from '$lib/icons/NoPhoto.svelte';
	import TrashIcon from '$lib/icons/Trash.svelte';
	import VideoTickIcon from '$lib/icons/VideoTick.svelte';

	type Props = {
		id: string;
		imgSrc: string | null;
		name: string;
		score: number | null;
		bottomChildren?: Snippet;
		onDelete?: () => void;
		isWatched?: boolean;
		onToggleWatched?: () => void;
		userRating?: number | null;
		onOpenRating?: () => void;
	};

	let {
		id,
		imgSrc,
		name,
		score,
		bottomChildren,
		onDelete,
		isWatched,
		onToggleWatched,
		userRating,
		onOpenRating,
	}: Props = $props();

	let titleElement = $state<HTMLParagraphElement | null>(null);
	let isTitleTruncated = $state(false);

	$effect(() => {
		if (titleElement) {
			isTitleTruncated = titleElement.scrollHeight > titleElement.clientHeight;
		}
	});
</script>

<a class="card" href={`/movie/${id}`}>
	<div class="score-wrapper">
		<Score {score} {userRating} onclick={onOpenRating} />
	</div>
	{#if onToggleWatched || onDelete}
		<div class="card__actions">
			{#if onToggleWatched}
				<Tooltip text={isWatched ? 'Просмотрено' : 'Отметить как просмотренное'}>
					<button
						class="card__action-btn"
						class:card__action-btn--active={isWatched}
						type="button"
						onclick={(e) => {
							e.preventDefault();
							onToggleWatched?.();
						}}
					>
						<VideoTickIcon />
					</button>
				</Tooltip>
			{/if}
			{#if onDelete}
				<Tooltip text="Удалить">
					<button
						class="card__action-btn card__action-btn--delete"
						type="button"
						onclick={(e) => {
							e.preventDefault();
							onDelete?.();
						}}
					>
						<TrashIcon />
					</button>
				</Tooltip>
			{/if}
		</div>
	{/if}
	<div class="card__image-wrapper">
		{#if imgSrc}
			<img src={imgSrc} alt="" width={266} height={400} class="card__image" />
		{:else}
			<div class="card__image card__image--placeholder">
				<NoPhotoImage />
			</div>
		{/if}
	</div>
	<Tooltip text={name} disabled={!isTitleTruncated}>
		<p class="card__title" bind:this={titleElement}>{name}</p>
	</Tooltip>
	{#if bottomChildren}
		{@render bottomChildren()}
	{/if}
</a>

<style>
	.card {
		display: block;
		position: relative;
		border-radius: 12px;
		background-color: var(--black-100);
		padding: 8px;
		width: 282px;
		height: 100%;
		text-decoration: none;
	}

	.score-wrapper {
		position: absolute;
		top: 16px;
		left: 16px;
	}

	.card__actions {
		display: flex;
		position: absolute;
		top: 16px;
		right: 16px;
		gap: 8px;
	}

	.card__action-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.85;
		transition:
			color 0.2s ease,
			opacity 0.2s ease;
		cursor: pointer;
		border: none;
		border-radius: 8px;
		background-color: var(--black-200);
		padding: 6px;
		color: var(--grey-400);

		&:hover {
			opacity: 1;
			color: var(--success-300);
		}
	}

	.card__action-btn--active {
		opacity: 1;
		color: var(--success-300);
	}

	.card__action-btn--delete {
		color: var(--error-300);

		&:hover {
			color: var(--error-300);
		}
	}

	.card__title {
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		margin: 12px 8px;
		overflow: hidden;
		color: var(--grey-50);
		font: var(--type-link-regular);
	}

	.card__image-wrapper {
		height: 400px;
		overflow: hidden;
	}

	.card__image {
		border-radius: 8px;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.card__image--placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--black-50);

		:global(svg) {
			opacity: 0.25;
			width: 84px;
			height: 84px;
			color: var(--grey-400);
		}
	}
</style>
