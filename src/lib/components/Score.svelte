<script lang="ts">
	import Star from '$lib/icons/Star.svelte';

	type Props = {
		score: number | null;
		userRating?: number | null;
		onclick?: () => void;
	};

	let { score, userRating = null, onclick }: Props = $props();

	const formattedScore = $derived((score ?? 0).toFixed(1));
</script>

{#if score !== null || onclick}
	<button class="score" class:score--clickable={Boolean(onclick)} {onclick} type="button">
		<Star filled={Boolean(userRating)} />
		<p>{formattedScore}</p>
	</button>
{/if}

<style>
	.score {
		display: flex;
		align-items: center;
		gap: 4px;
		z-index: 1;
		cursor: default;
		border: none;
		border-radius: 8px;
		background-color: var(--black-400);
		padding: 4px 8px;
		color: var(--warning-500);
	}

	.score--clickable {
		transition: opacity 0.2s ease;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}
</style>
