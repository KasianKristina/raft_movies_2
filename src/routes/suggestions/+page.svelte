<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import SuggestionCard from '$lib/components/SuggestionCard.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import { getNoun } from '$lib/utils/formatNames';
	import { createSearchIndex } from '$lib/utils/search';
	import type { PageData } from './$types';
	import DeleteConfirmationModal from '$lib/components/DeleteConfirmationModal.svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	let inputValue = $state('');
	let suggestionToDeleteId = $state<string | null>(null);
	let suggestionToDeleteName = $state<string | null>(null);
	let showDeleteModal = $state(false);
	let isDeleting = $state(false);
	let deleteSuggestionFormEl: HTMLFormElement;
	let deleteSuggestionInputEl: HTMLInputElement;

	const handleDelete = () => {
		if (!suggestionToDeleteId) return;
		deleteSuggestionInputEl.value = suggestionToDeleteId;
		deleteSuggestionFormEl.requestSubmit();
	};

	const suggestionsIndex = $derived(
		createSearchIndex(data.suggestions, (suggestion) =>
			[
				suggestion.name,
				suggestion.description,
				suggestion.author.first_name,
				suggestion.author.last_name,
			]
				.filter(Boolean)
				.join(' '),
		),
	);
	const filteredSuggestions = $derived(suggestionsIndex.search(inputValue));
</script>

<svelte:head>
	<title>Подборки фильмов</title>
</svelte:head>

<h1 class="title">Подборки фильмов</h1>
<section class="suggest">
	<h2 class="visually-hidden">Блок с подборками фильмов от пользователей</h2>
	<div class="suggest__search">
		<Input label="Поиск подборок с фильмами" bind:value={inputValue}>
			{#snippet leftIcon()}
				<SearchIcon />
			{/snippet}
		</Input>
	</div>
	<p class="suggest__result">
		{filteredSuggestions.length}
		{getNoun(filteredSuggestions.length, 'Результат', 'Результата', 'Результатов')}
	</p>
	<ul class="cards">
		{#each filteredSuggestions as suggestion (suggestion.id)}
			<li>
				<SuggestionCard
					{...suggestion}
					authorName={`${suggestion.author.first_name} ${suggestion.author.last_name}`}
					countAll={suggestion.movies.length}
					countAlreadyWatched={suggestion.movies.filter(({ movie }) =>
						movie.views.some((view) => view.user_id === data.user?.id && view.is_watched),
					).length}
					onDelete={suggestion.author.id === data.user?.id
						? () => {
								suggestionToDeleteId = suggestion.id;
								suggestionToDeleteName = suggestion.name;
								showDeleteModal = true;
							}
						: undefined}
				/>
			</li>
		{/each}
	</ul>
</section>

<DeleteConfirmationModal
	bind:isOpen={showDeleteModal}
	itemType="подборку"
	itemName={suggestionToDeleteName ?? ''}
	onConfirm={handleDelete}
	onCancel={() => {
		showDeleteModal = false;
		suggestionToDeleteId = null;
		suggestionToDeleteName = null;
	}}
	{isDeleting}
/>

<form
	method="POST"
	action="?/deleteSuggestion"
	hidden
	bind:this={deleteSuggestionFormEl}
	use:enhance={() => {
		isDeleting = true;

		return async ({ result }) => {
			isDeleting = false;
			showDeleteModal = false;
			suggestionToDeleteId = null;
			suggestionToDeleteName = null;

			if (result.type === 'success') {
				await invalidateAll();
				toast.success('Подборка успешно удалена!');
			} else {
				toast.error('Ошибка при удалении подборки');
			}
		};
	}}
>
	<input type="hidden" name="suggestion_id" bind:this={deleteSuggestionInputEl} />
</form>

<style>
	.title {
		margin-top: 80px;
		margin-bottom: 30px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.suggest__search {
		display: flex;
		align-items: start;
		gap: 8px;
		max-width: 50%;
		color: var(--grey-600);
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, 290px);
		justify-content: center;
		gap: 16px 24px;
		margin: 50px auto;
		width: 100%;
	}

	.suggest__result {
		color: var(--grey-50);
		font: var(--type-link-regular);
	}

	@media (width <= 768px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.suggest__search {
			flex-direction: column;
			width: auto;
		}

		.suggest__result {
			padding-top: 25px;
		}
	}
</style>
