<script lang="ts">
	import millify from 'millify';
	import ReadOnlyRating from '../../../../../shared/components/ReadOnlyRating.svelte';
	import type { WidgetTranslation } from '../../../../../stores/settingsStore';
	import { ReadOnlyRatingSize, ReviewsJetTab } from '../../../../../types';

	export let rtl: boolean;
	export let totalDocs: number;
	export let starColor: string;
	export let fontFamily: string;
	export let overrallRating: number;
	export let translation: WidgetTranslation;
	export let showReviewsAverage: boolean;
	export let showProductReviews: boolean;
	export let showBusinessReviews: boolean;
	export let activeTab: ReviewsJetTab;
	export let textColor: string;
	export let buttonBackgroundColor: string;
	export let toggleTabs: (tab: ReviewsJetTab) => void;
	export let useMyWebsiteFontFamily: boolean;
	export let productReviewsTotalDocs: number;
	export let publishedBusinessReviews: number;
	export let publishedProductReviews: number;
	export let totalPublishedReviews: number;

	let total = 0;
	let reviewJetModalHeader: HTMLDivElement;
	let reviewsjetModalTitle: HTMLDivElement;
	let happyCustomersTitleElement: HTMLDivElement;

	const { productReviewsTab, businessReviewsTab, widgetTitle, happyCustomersTitle } = translation;

	$: if (reviewJetModalHeader) {
		if (!useMyWebsiteFontFamily && fontFamily) {
			reviewJetModalHeader.style.fontFamily = `${fontFamily}, sans-serif`;
		}

		if (!totalDocs && !productReviewsTotalDocs) {
			reviewJetModalHeader.style.display = 'none';
			reviewJetModalHeader.style.boxShadow = 'none';
			reviewJetModalHeader.style.border = 'none';
		}

		if (rtl) {
			reviewJetModalHeader.style.direction = 'rtl';
		}
	}

	if (showBusinessReviews && showProductReviews) {
		total = totalPublishedReviews;
	} else if (showBusinessReviews && !showProductReviews) {
		total = publishedBusinessReviews;
	} else if (!showBusinessReviews && showProductReviews) {
		total = publishedProductReviews;
	}

	const title = widgetTitle.replace(/{totalReview}/gi, `${millify(total)}`);

	$: if (!!showProductReviews && !!showBusinessReviews) {
		activeTab = ReviewsJetTab.BUSINESS;
	} else if (!!showProductReviews && !showBusinessReviews) {
		activeTab = ReviewsJetTab.PRODUCT;
	} else if (!showProductReviews && !!showBusinessReviews) {
		activeTab = ReviewsJetTab.BUSINESS;
	}

	$: if (reviewsjetModalTitle) {
		reviewsjetModalTitle.style.color = textColor;
	}

	$: if (happyCustomersTitleElement) {
		happyCustomersTitleElement.style.color = textColor;
	}
</script>

<div class="reviews-jet-summary">
	{#if total}
		{#if showReviewsAverage}
			<div class="overrall-rating">
				<ReadOnlyRating rating={overrallRating} {starColor} size={ReadOnlyRatingSize.SMALL} />
			</div>
		{/if}
		<div class="reviews-jet-modal-title" bind:this={reviewsjetModalTitle}>
			{title}
		</div>
	{/if}
</div>

{#if total}
	<div
		class="widget-title"
		bind:this={happyCustomersTitleElement}
		style={`${
			!showBusinessReviews || !showProductReviews ? 'border-bottom: 1px solid #e3e3e3; padding-bottom: 15px' : ''
		}; box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);`}
	>
		{happyCustomersTitle}
	</div>

	{#if !!showBusinessReviews && !!showProductReviews}
		<div class="reviewsJet-modal-header" bind:this={reviewJetModalHeader}>
			<div class="reviewsJet-tabs">
				{#if showBusinessReviews}
					<div
						style="color: {textColor}; border-bottom: {activeTab === ReviewsJetTab.BUSINESS
							? `2px solid ${buttonBackgroundColor}`
							: ''}; {!showBusinessReviews || !showProductReviews
							? 'max-width: fit-content; padding-left: 25px; padding-right: 25px;'
							: ''}"
						class={`reviewsJet-tab ${activeTab === ReviewsJetTab.BUSINESS ? 'reviewsJet-active-tab' : ''}`}
						on:click={() => toggleTabs(ReviewsJetTab.BUSINESS)}
						on:keydown={() => {}}
					>
						{businessReviewsTab}
						{showBusinessReviews && showProductReviews ? `(${millify(publishedBusinessReviews)})` : ''}
					</div>
				{/if}
				{#if showProductReviews}
					<div
						style="color: {textColor}; border-bottom: {activeTab === ReviewsJetTab.PRODUCT
							? `2px solid ${buttonBackgroundColor}`
							: ''}; {!showBusinessReviews || !showProductReviews
							? 'max-width: fit-content; padding-left: 25px; padding-right: 25px;'
							: ''}"
						class={`reviewsJet-tab ${activeTab === ReviewsJetTab.PRODUCT ? 'reviewsJet-active-tab' : ''}`}
						on:click={() => toggleTabs(ReviewsJetTab.PRODUCT)}
						on:keydown={() => {}}
					>
						{productReviewsTab}
						{showBusinessReviews && showProductReviews ? `(${millify(publishedProductReviews)})` : ''}
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/if}

<style type="text/scss">
	.widget-title {
		color: #000;
		text-align: center;
		padding: 0px 15px 25px;
		font-size: 15px;
		font-weight: bold;
	}
	.reviewsJet-modal-header {
		position: relative;
	}
	.reviewsJet-tabs {
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #f8f8f8;
		padding: 0;
		/* box-shadow: 0px 7px 17px -10px RGB(0 0 0 / 30%); */
		box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);

		@media (max-width: 644px) {
			/*  */
		}

		.reviewsJet-tab {
			display: flex;
			align-items: center;
			gap: 5px;
			justify-content: center;
			text-align: center;
			letter-spacing: 0px;
			/* font-weight: 700; */
			font-size: 14px;
			padding: 12px 0;
			flex: 1;
			cursor: pointer;
			color: #000000;
			border-bottom: 2px solid transparent;
			&.reviewsJet-active-tab {
			}
			@media (max-width: 644px) {
				width: 100%;
			}
		}
		@media (max-width: 644px) {
			/* display: block; */
		}
	}
	.reviews-jet-modal-header {
		color: #000;
		display: flex;
		flex-direction: row;
		font-size: 15px;
		font-weight: 700;
		align-items: center;
		padding: 0 15px;
		min-height: 45px;
		justify-content: space-between;
		-webkit-box-shadow: 0px 7px 17px -10px RGB(0 0 0 / 30%);
		box-shadow: 0px 7px 17px -10px RGB(0 0 0 / 30%);
		/* box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1); */
		/* min-height: 30px; */
		position: relative;

		@media (max-width: 644px) {
			padding: 20px;
			height: unset;
		}
	}

	.reviews-jet-summary {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		color: #000;
		justify-content: center;
		line-height: 15px;
		font-size: 15px;
		padding: 15px 0 15px;

		.reviews-jet-modal-title {
			width: 375px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #403c3c;
			text-align: center;
			font-size: 13px;
		}
	}

	.overrall-rating {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;
	}

	@media (max-width: 320px) {
		.reviews-jet-modal-title {
			font-size: 15px;
		}
	}
	@media (max-width: 445px) {
		.overrall-rating {
			margin: auto;
			width: min-content;
		}
		.reviews-jet-summary {
			display: block;
			width: 100%;
			text-align: center;
		}
		.reviews-jet-modal-title {
			margin-top: 10px;
			width: 100% !important;
			white-space: normal !important;
			overflow: visible !important;
			text-overflow: unset !important;
		}
	}
</style>
