<script lang="ts">
	type Props = {
		id: string;
		name: string;
		countAlreadyWatched: number;
		countAll: number;
		description?: string;
		author: string;
		isNeedDisplayAuthor?: boolean;
		beginningOfVoting?: number;
		endOfVoting?: number;
	};

	const currentTimestamp = new Date().getTime();

	let {
		id,
		name,
		countAlreadyWatched,
		countAll,
		description,
		author,
		isNeedDisplayAuthor = true,
		beginningOfVoting,
		endOfVoting,
	}: Props = $props();
</script>

<a
	class="item"
	class:votingItem={beginningOfVoting &&
		endOfVoting &&
		beginningOfVoting <= currentTimestamp &&
		endOfVoting >= currentTimestamp}
	href={`/suggestion/${id}`}
>
	<div class="item__name-wrapper">
		<p class="item__name" title={name}>{name}</p>
		{#if endOfVoting}
			<p class="time">
				{`Время голосования до ${new Date(endOfVoting).toLocaleDateString()}`}
			</p>
		{/if}
	</div>
	<p class="item__count">
		{`Просмотрено ${countAlreadyWatched} из ${countAll}`}
	</p>
	<p class="item__description" title={description}>{description ?? ''}</p>

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
		text-decoration: none;
	}

	.votingItem {
		border: 1.5px solid var(--warning-400);
	}

	.item__name-wrapper {
		position: relative;
	}

	.time {
		position: absolute;
		top: 40px;
		margin-bottom: 10px;
		color: var(--warning-400);
		font: var(--type-caption);
	}

	.item__name {
		margin-bottom: 20px;
		height: 40px;
		font: var(--type-link-regular);
		-webkit-line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		color: var(--grey-50);
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
