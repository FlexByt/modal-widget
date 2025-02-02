<script lang="ts">
	import { ActiveView } from '../../../../shared/utils/types';
	import type { WidgetSettings } from '../../../../stores/settingsStore';

	export let settings: WidgetSettings;
	export let setActiveView: (view: ActiveView) => void;
	export let useMyWebsiteFontFamily: boolean;

	let thankYouWrapper: HTMLDivElement;
	let reviewsJetbtn: HTMLButtonElement;

	const {
		translation: { backToReviews },
		brandingSettings: { fontFamily },
		modalWidget: { textColor, buttonBackgroundColor, buttonTextColor },
		thankYouPage: { image, imageBorderRadius, message, showImage, title },
	} = settings;

	$: if (thankYouWrapper) {
		if (fontFamily && !useMyWebsiteFontFamily) {
			thankYouWrapper.style.fontFamily = `${fontFamily}, sans-serif`;
		}

		thankYouWrapper.style.color = textColor;
	}

	$: if (reviewsJetbtn) {
		reviewsJetbtn.style.color = buttonTextColor;
		reviewsJetbtn.style.backgroundColor = buttonBackgroundColor;
	}
</script>

<div id="reviews-jet-thank-you-wrapper" class="reviews-jet-thank-you-wrapper" bind:this={thankYouWrapper}>
	{#if showImage}
		<div class="reviews-jet-thank-you-icon-wrapper">
			<img alt="" src={image} style={`border-radius: ${imageBorderRadius}%`} />
		</div>
	{/if}

	<span class="reviews-jet-form-title">{title}</span>

	<span class="reviews-jet-thank-you-description">
		{message}
	</span>
	<div class="reviews-jet-share-on-social-medial-wrapper">
		<span class="reviews-jet-facebook-icon" />
		<span class="reviews-jet-twitter-icon" />
	</div>
	<div style="width: 200px; margin: 0 auto;">
		<button
			class="reviews-jet-add-review-button reviews-jet-button"
			on:click={() => setActiveView(ActiveView.REVIEWS)}
			on:keydown={() => {}}
			bind:this={reviewsJetbtn}
		>
			{backToReviews}
		</button>
	</div>
</div>

<style type="text/scss">
	.reviews-jet-thank-you-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: calc(100% - 60px);
		padding: 30px 0;

		.reviews-jet-form-title {
			font-weight: 700;
			font-size: 20px;
			line-height: 22px;
			color: #000;
			text-align: center;
			width: 100%;
			display: block;
			margin: 0 0 15px;
		}

		.reviews-jet-thank-you-icon-wrapper {
			cursor: pointer;
			margin: 0 auto 30px;
			text-align: center;
			height: 180px;

			img {
				height: 100%;
				max-height: 180px;
				border-radius: 100%;
				/* border: 1px solid rgb(221, 221, 221); */
				padding: 1px;
				min-width: 180px;
			}
		}
		.reviews-jet-thank-you-description {
			font-size: 14px;
			text-align: center;
			width: 380px;
			display: block;
		}
		.reviews-jet-share-on-social-medial-wrapper {
			display: flex;
			justify-content: center;
			padding-top: 30px;
		}
		.reviews-jet-add-review-button {
			color: #f7f7f7;
			width: 100%;
		}
		.reviews-jet-button {
			border: none;
			padding: 10px 20px;
			text-align: center;
			-webkit-transition-duration: 0.4s;
			transition-duration: 0.4s;
			text-decoration: none;
			font-size: 15px;
			cursor: pointer;
			border-radius: 10px;
		}
	}
	@media (max-width: 414px) {
		.reviews-jet-thank-you-wrapper {
			padding: 20px 25px 0 25px;
			.reviews-jet-thank-you-description {
				width: auto;
			}
		}
	}
</style>
