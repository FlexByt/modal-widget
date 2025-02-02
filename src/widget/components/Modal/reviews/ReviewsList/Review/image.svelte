<script lang="ts">
	import { onMount } from 'svelte';
	import CameraFullIcon from '../../../../../../shared/components/CameraFullIcon.svelte';
	import ImagePlaceholder from '../../../../../../shared/components/ImagePlaceholder.svelte';
	export let picture: string;
	export let videoUrl: string | undefined = undefined;
	export let isVideoPoster: boolean | undefined = false;
	export let toggleReviewPictureModal: (props: { pic: string; videoUrl?: string }) => void;

	let playBtn: HTMLButtonElement;
	let preloaderWrapper: HTMLDivElement;
	let isImageLoaded = false;
	let divStyle = '';

	// Function to preload the image
	function preloadImage(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => reject(new Error('Image failed to load'));
			img.src = url;
		});
	}

	onMount(async () => {
		try {
			await preloadImage(picture);
			isImageLoaded = true;
			divStyle = `display: block; background-image: url(${picture});`;
		} catch (error) {
			console.error('Failed to load image:', error);
		}
	});
</script>

{#if !isImageLoaded}
	<div
		class="preloaderWrapper"
		bind:this={preloaderWrapper}
		on:click={() => toggleReviewPictureModal({ pic: picture, videoUrl })}
		on:keydown={() => {}}
		style={`${isVideoPoster ? 'height: 150px; width: 250px' : ''}`}
	>
		{#if isVideoPoster}
			<CameraFullIcon />
		{:else}
			<ImagePlaceholder />
		{/if}
	</div>
{/if}

<div
	class="wrapper"
	style={`${isVideoPoster ? 'height: 154px; width: 254px;' : ''}${divStyle}`}
	on:click={() => toggleReviewPictureModal({ pic: picture, videoUrl })}
	on:keydown={() => {}}
>
	{#if isVideoPoster}
		<span class="tag">
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 16 16"
				height="16px"
				width="16px"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
				/></svg
			>
		</span>
		<button class="play-btn" bind:this={playBtn}>
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 384 512"
				height="16"
				width="16"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
				/></svg
			>
		</button>
	{/if}
</div>

<style type="text/scss">
	.reviewsjet-review-pic {
		max-width: 100px;
		max-height: 100px;
		border: 1px solid #e0e0e0;
		padding: 2px;
		border-radius: 5px;
		cursor: pointer;
		display: none;
		/* @media (max-width: 644px) {
			max-width: 30px;
			max-height: 30px;
		} */
	}
	.preloaderWrapper {
		width: 100px;
		height: 100px;
		cursor: pointer;
		background-color: rgb(237, 237, 237);
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #adadad;
		padding: 2px;
	}
	.wrapper {
		display: none;
		width: max-content;
		position: relative;
		width: 100px;
		height: 100px;
		background-size: cover;
		background-position: center;
		transition: background-image 0.5s ease-in-out;
		cursor: pointer;
		border-radius: 5px;

		&:hover {
			.play-btn {
				display: flex;
			}
		}

		.play-btn {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: rgba(0, 0, 0, 0.4);
			cursor: pointer;
			width: 35px;
			height: 35px;
			color: #fff;
			border: 1px solid #b6b6b6;
			border-radius: 50%;
			justify-content: center;
			align-items: center;
			display: none;
		}

		.tag {
			display: flex;
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 9999;
			background-color: rgba(0, 0, 0, 0.4);
			cursor: pointer;
			width: 25px;
			height: 20px;
			/* display: none; */
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #fff;
			border-radius: 5px;
			border: 1px solid #b6b6b6;
		}
	}
</style>
