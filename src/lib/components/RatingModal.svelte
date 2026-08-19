<script lang="ts">
	import Modal from './Modal.svelte';
	import RatingStars from './RatingStars.svelte';

	type Props = {
		isOpen: boolean;
		movieId: string;
		currentRating?: number | null;
		onRated: (userRating: number, movieRating: number) => void;
		onClose?: () => void;
	};

	let {
		isOpen = $bindable(false),
		movieId,
		currentRating = null,
		onRated,
		onClose,
	}: Props = $props();

	const handleSkip = () => {
		isOpen = false;
		onClose?.();
	};
</script>

<Modal bind:open={isOpen}>
	{#key isOpen}
		<RatingStars
			{movieId}
			{currentRating}
			{onRated}
			onSkip={handleSkip}
			onClose={() => (isOpen = false)}
		/>
	{/key}
</Modal>
