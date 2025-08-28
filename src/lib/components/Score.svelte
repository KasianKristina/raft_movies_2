<script lang="ts">
	import Star from '$lib/icons/Star.svelte';

	type Props = {
		score?: string;
	};

	let { score }: Props = $props();
</script>

{#if score}
	<div class="score">
		<Star />
		<p>{score}</p>
	</div>
{/if}

<style>
	.score {
		display: flex;
		align-items: center;
		gap: 4px;
		z-index: 1;
		border-radius: 8px;
		background-color: var(--black-400);
		padding: 4px 8px;
		color: var(--warning-500);
	}
</style>
