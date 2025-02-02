<script lang="ts">
	import { onMount } from 'svelte';
	import Preloader from '../../../../../../shared/components/Preloader.svelte';
	import { ReviewType } from '../../../../../../types/review';

	export let review: ReviewType;

	let videoElement;
	let isPosterLoaded = false;

	const { video, videoPoster } = review;

	// Preload poster image
	function preloadPoster(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => reject(new Error('Poster failed to load'));
			img.src = url;
		});
	}

	// Use preloadPoster function when the component is mounted

	onMount(async () => {
		try {
			await preloadPoster(videoPoster);
			isPosterLoaded = true; // Poster loaded successfully
		} catch (error) {
			console.error(error);
			isPosterLoaded = false; // Handle poster load failure
		}
	});
</script>

{#if !isPosterLoaded}
	<!-- Display preloader or loading text when poster is not loaded -->
	<div class="loading-text">
		<Preloader />
	</div>
{/if}

{#if isPosterLoaded}
	<video poster={videoPoster} controls={false} bind:this={videoElement}>
		<source src={video} type="video/mp4" />
		<track src="" kind="captions" />
		Your browser does not support the video tag.
	</video>
{/if}

<style type="text/scss">
	video {
		width: 100%;
		max-width: 400px;
		border-radius: 5px;
	}

	.preloader {
		width: 50px;
		height: 50px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 20px auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		text-align: center;
	}
</style>
