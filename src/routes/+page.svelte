<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SuggestionCard from '$lib/components/SuggestionCard.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import VideoPlayIcon from '$lib/icons/VideoPlayIcon.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Toaster, toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	let showModal = $state(false);

	let { data }: { data: PageData } = $props();
	let { form: formData, user } = data;

	const suggestionsList = $derived(data.suggestions);

	let { form, errors, enhance } = superForm(formData, {
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Подборка успешно создана!');
				showModal = false;
			}
		},
		onError() {
			toast.error('Ошибка при создании подборки');
		},
	});
</script>

<svelte:head>
	<title>Главная</title>
</svelte:head>

<Toaster position="top-right" richColors />
<h1 class="title">{`Добро пожаловать, ${user.first_name} ${user.last_name}`}</h1>
<section class="welcome-section">
	<h2 class="visually-hidden">Папки с подборками фильмов</h2>
	<ul class="welcome-section__folders">
		{#each suggestionsList as suggestion (suggestion.id)}
			<li>
				<SuggestionCard
					{...suggestion}
					authorName={`${suggestion.author.first_name} ${suggestion.author.last_name}`}
					countAll={suggestion.movies.length}
					countAlreadyWatched={suggestion.movies.filter(({ movie }) =>
						movie.views.some((view) => view.user_id === user?.id && view.is_watched),
					).length}
				/>
			</li>
		{/each}
	</ul>
</section>
<section class="quick-links">
	<h2 class="quick-links__title">Быстрые ссылки</h2>
	<div class="quick-links__list">
		<a href="/suggestions" class="quick-links__item">Подборки</a>
		<button class="quick-links__item" onclick={() => (showModal = true)}>Добавить</button>
	</div>
</section>

<Modal bind:open={showModal}>
	<div class="modal__wrapper">
		<p class="modal__title">Новая подборка</p>
		<form class="inputs__wrapper" method="POST" use:enhance>
			<Input
				label="Название"
				type="string"
				name="name"
				bind:value={$form.name}
				errorMessage={$errors.name?.[0] as string}
			>
				{#snippet leftIcon()}
					<VideoPlayIcon />
				{/snippet}
			</Input>
			<Textarea label="Описание" name="description" bind:value={$form.description} />
			<Button type="submit">Создать</Button>
		</form>
	</div>
</Modal>

<style>
	.title {
		margin-top: 80px;
		width: 100%;
		color: var(--grey-50);
		font: var(--type-heading-two);
		text-align: left;
	}

	.welcome-section__folders {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin-top: 40px;
		margin-bottom: 80px;
		width: 100%;
	}

	.welcome-section__folders {
		display: grid;
		grid-template-columns: repeat(auto-fill, 290px);
		justify-content: center;
		gap: 16px 24px;
		margin: 50px auto;
		width: 100%;
	}

	.quick-links__title {
		color: var(--grey-50);
		font: var(--type-heading-five);
		text-align: center;
	}

	.quick-links__list {
		display: flex;
		gap: 24px;
		margin-top: 40px;
	}

	.quick-links__item {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 12px;
		background-color: var(--grey-900);
		width: 100%;
		min-height: 104px;
		color: var(--primary-400);
		font: var(--type-link-regular);
		text-decoration: none;
	}

	.modal__wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.modal__title {
		margin-bottom: 40px;
		color: var(--grey-100);
		font: var(--type-heading-four);
		text-align: center;
	}

	.inputs__wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 20px;
		color: var(--grey-600);
	}

	@media (width <= 768px) {
		.title {
			font: var(--type-heading-three);
			text-align: center;
		}

		.welcome-section__folders {
			justify-content: center;
		}

		.quick-links__list {
			flex-direction: column;
		}
	}
</style>
