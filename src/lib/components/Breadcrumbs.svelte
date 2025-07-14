<script lang="ts">
	type Props = {
		breadcrumbs: { link: string; text: string }[];
	};

	let { breadcrumbs }: Props = $props();
</script>

<ul class="breadcrumbs">
	{#each breadcrumbs as crumb, i}
		<li>
			<a href={crumb.link} class="crumb">{crumb.text}</a>
			{#if i !== breadcrumbs.length - 1}
				<span class="separator">/</span>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.breadcrumbs {
		display: flex;
		align-items: center;
		color: var(--grey-400);
		font: var(--type-body-extra-small);
	}

	.crumb {
		color: var(--primary-200);
	}

	.separator {
		margin: 0 8px;
	}
</style>
