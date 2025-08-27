<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import Tooltip from './Tooltip.svelte';

	type Props = {
		id: string;
		name: string;
		countAlreadyWatched: number;
		countAll: number;
		description?: string;
		author: string;
		isNeedDisplayAuthor?: boolean;
	};

	let {
		id,
		name,
		countAlreadyWatched,
		countAll,
		description,
		author,
		isNeedDisplayAuthor = true,
	}: Props = $props();

	let isTruncated = $state(false);

	const truncated: Attachment = (element) => {
		$effect(() => {
			if (element) {
				isTruncated = element.scrollHeight > element.clientHeight;
			}
		});
	};
</script>

<a class="item" href={`/suggestion/${id}`}>
	<div class="item__name-wrapper">
		<p class="item__name">{name}</p>
	</div>
	<p class="item__count">
		{`Просмотрено ${countAlreadyWatched} из ${countAll}`}
	</p>

	{#snippet suggestionDescription()}
		<p class="item__description" {@attach truncated}>
			{description ?? ''}
		</p>
	{/snippet}

	{#if isTruncated}
		<Tooltip text={description ?? ''}>
			{@render suggestionDescription()}
		</Tooltip>
	{:else}
		{@render suggestionDescription()}
	{/if}

	{#if isNeedDisplayAuthor}
		<p class="item__author">Автор: {author}</p>
	{/if}
</a>

<style>
	.item {
		display: block;
		cursor: pointer;
		border-radius: 12px;
		background-color: var(--black-100);
		padding: 16px;
		width: 100%;
		height: 100%;
		text-decoration: none;
	}

	.item__name-wrapper {
		position: relative;
	}

	.item__name {
		margin-bottom: 20px;
		height: 40px;
		color: var(--grey-50);
		font: var(--type-link-regular);
		text-decoration: none;
	}

	.item__description {
		font: var(--type-body-regular);
		-webkit-line-clamp: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		margin-bottom: 15px;
		height: 77px;
		overflow: hidden;
		color: var(--grey-50);
		text-align: left;
	}

	.item__count {
		margin-bottom: 15px;
		color: var(--grey-400);
		font: var(--type-caption);
	}

	.item__author {
		color: var(--primary-400);
		font: var(--type-body-extra-small);
	}
</style>
