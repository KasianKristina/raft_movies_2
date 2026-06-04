<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import Tooltip from './Tooltip.svelte';
	import TrashIcon from '$lib/icons/Trash.svelte';

	type Props = {
		id: string;
		name: string;
		countAlreadyWatched?: number;
		countAll?: number;
		description?: string;
		authorName: string;
		isNeedDisplayAuthor?: boolean;
		onDelete?: () => void;
	};

	let {
		id,
		name,
		countAlreadyWatched = 0,
		countAll = 0,
		description,
		authorName,
		isNeedDisplayAuthor = true,
		onDelete,
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

<a class="item" class:item--deletable={Boolean(onDelete)} href={`/suggestion/${id}`}>
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
		<p class="item__author">Автор: {authorName}</p>
	{/if}
	{#if onDelete}
		<button
			class="item__button--delete"
			onclick={(e) => {
				e.preventDefault();
				onDelete?.();
			}}
		>
			<TrashIcon />
		</button>
	{/if}
</a>

<style>
	.item {
		display: block;
		position: relative;
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

	.item--deletable .item__name {
		padding-right: 36px;
	}

	.item__description {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		font: var(--type-body-regular);
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

	.item__button--delete {
		display: flex;
		position: absolute;
		top: 8px;
		right: 8px;
		justify-content: center;
		align-items: center;
		opacity: 0.85;
		cursor: pointer;
		border: none;
		border-radius: 8px;
		background-color: var(--black-200);
		padding: 6px;
		color: var(--error-300);

		&:hover {
			opacity: 1;
		}
	}
</style>
