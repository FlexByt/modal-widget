<script lang="ts">
	import { blur, fade } from 'svelte/transition';
	import Preloader from '../../../shared/components/Preloader.svelte';

	export let reviewVideo: string;
	export let selectedReviewPicture: string;
	export let toggleReviewPictureModal: (props: { pic: string | null }) => void;

	let loadedImage: HTMLImageElement;
	let preloaderWrapper: HTMLDivElement;
	let loadedImageWrapper: HTMLDivElement;

	function preloadImage(url: string) {
		const image = new Image();

		image.onload = function () {
			if (loadedImage) {
				loadedImage.src = url;
				setTimeout(() => {
					loadedImageWrapper.style.display = 'block';
					preloaderWrapper.style.display = 'none';
				}, 500);
			}
		};

		image.onerror = function () {
			preloaderWrapper.style.display = 'none';
		};

		image.src = url;
	}

	function preloadVideo() {
		loadedImageWrapper.style.display = 'block';
		preloaderWrapper.style.display = 'none';
	}

	preloadImage(selectedReviewPicture);
</script>

<div class="reviewsjet-pictures-modal">
	<div
		class="reviewsjet-pictures-mask"
		on:click={() => toggleReviewPictureModal({ pic: null })}
		on:keydown={() => {}}
	/>
	<div class="reviewsjet-pictures-dialog" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
		<div bind:this={loadedImageWrapper} class="loaded-img-wrapper">
			{#if reviewVideo}
				<video
					controls
					preload="auto"
					autoPlay={true}
					on:loadeddata={preloadVideo}
					controlsList="nodownload"
					disablepictureinpicture
				>
					<source src={reviewVideo} />
					<track src="" kind="captions" />
				</video>
			{:else}
				<img src="" alt="" bind:this={loadedImage} in:blur={{ duration: 300 }} out:blur={{ duration: 200 }} />
			{/if}

			<div class="reviewsjet-close-button-wrapper">
				<button on:click={() => toggleReviewPictureModal({ pic: null })} on:keydown={() => {}}>
					<svg
						stroke="currentColor"
						fill="none"
						stroke-width="0"
						viewBox="0 0 24 24"
						height="20px"
						width="20px"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
							fill="currentColor"
						/></svg
					>
				</button>
			</div>
		</div>
		<div bind:this={preloaderWrapper}>
			<Preloader />
		</div>
	</div>
</div>

<style type="text/scss">
	.reviewsjet-pictures-modal {
		color: #000;
		z-index: 2147483648;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.loaded-img-wrapper {
			display: none;
			width: 100%;
		}

		.reviewsjet-pictures-mask {
			display: block;
			z-index: 901;
			background: #000;
			width: 100%;
			height: 100%;
			-moz-opacity: 1;
			opacity: 1;
			filter: opacity(100);
			-webkit-transition: opacity 0.5s ease-out 0s;
			-moz-transition: opacity 0.5s ease-out 0s;
			-ms-transition: opacity 0.5s ease-out 0s;
			-o-transition: opacity 0.5s ease-out 0s;
			transition: opacity 0.5s ease-out 0s;
			position: fixed;
			left: 0;
			top: 0;
			cursor: pointer;
		}

		.reviewsjet-pictures-dialog {
			position: relative;
			max-height: 90%;
			max-width: 90%;
			min-height: 149px;
			/* background: #ffffff; */
			border-radius: 15px;
			z-index: 1000;
			margin: 0 auto;
			-webkit-transition: top 0.7s ease-in-out 0.1s;
			-moz-transition: top 0.7s ease-in-out 0.1s;
			-ms-transition: top 0.7s ease-in-out 0.1s;
			-o-transition: top 0.7s ease-in-out 0.1s;
			transition: top 0.7s ease-in-out 0.1s;
			display: flex;
			align-items: center;
			justify-content: center;
			img,
			video {
				padding: 5px;
				border: 1px solid #424242;
				border-radius: 15px;
				width: calc(100% - 10px);
				height: calc(100% - 10px);
				max-width: 1000px;
				max-height: 800px;
			}

			.close-icon-wrapper {
				cursor: pointer;
				height: 34px;
				width: 34px;
				border-radius: 50%;
				position: absolute;
				right: -45px;
				top: 0px;
				opacity: 1;
				color: #fff;
				/* transition-delay: 300ms; */

				&:hover {
					background: #606060;
				}
				@media (max-width: 644px) {
					right: 0;
					color: #000;
					z-index: 9999;
				}
			}
			.reviewsjet-close-button-wrapper {
				position: absolute;
				top: 10px;
				right: 10px;
				@media (max-width: 644px) {
				}
				button {
					border: 0;
					background: rgba(255, 253, 253, 0.5019607843);
					color: #000;
					border-radius: 50%;
					cursor: pointer;
					height: 30px;
					width: 30px;
					display: flex;
					justify-content: center;
					align-items: center;
					&:hover {
						background: #fffdfd;
					}

					@media (max-width: 644px) {
						/* padding: 5px 20px; */
					}
				}
			}
		}

		@media (max-width: 644px) {
			.reviewsjet-pictures-dialog {
				/* top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				border-radius: 0;
				height: 100%;
				width: 100%;
				max-width: 644px;
				background-color: #000;
				border: 10px solid red; */
			}
		}
	}
</style>
