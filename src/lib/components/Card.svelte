<script lang="ts">
	import type { Snippet } from 'svelte';
	import Score from './Score.svelte';

	type Props = {
		id: string;
		imgSrc?: string;
		name: string;
		score?: string;
		bottomChildren?: Snippet;
	};

	let { imgSrc, name, score, bottomChildren }: Props = $props();
</script>

<div class="card">
	<div class="score-wrapper">
		<Score {score} />
	</div>
	<div class="card__image-wrapper">
		<img
			src={imgSrc}
			alt={`постер к фильму ${name}`}
			width={266}
			height={400}
			class="card__image"
		/>
	</div>
	<p class="card__title" title={name}>{name}</p>
	{#if bottomChildren}
		{@render bottomChildren()}
	{/if}
</div>

<style>
	.card {
		position: relative;
		border-radius: 12px;
		background-color: var(--black-100);
		padding: 8px;
		width: 282px;
	}

	.score-wrapper {
		position: absolute;
		top: 16px;
		left: 16px;
	}

	.card__title {
		margin: 24px 0 24px 8px;
		overflow: hidden;
		color: var(--grey-50);
		font: var(--type-link-regular);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card__image-wrapper {
		height: 400px;
	}

	.card__image {
		border-radius: 12px;
	}
</style>
