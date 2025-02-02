<script lang="ts">
	import Scrollbar from 'smooth-scrollbar';
	import { ActiveView, Loading } from '../../../../../shared/utils/types';
	import type { ThirdpartyAccount, WidgetSettings } from '../../../../../stores/settingsStore';
	import { ReviewsJetPlatform, ReviewsJetTab } from '../../../../../types';
	import EmptyState from '../EmptyState/index.svelte';
	import Review from './Review/index.svelte';

	export let rtl: boolean;
	export let page = 1;
	export let siteId: string;
	export let instanceId: string;
	export let hasNextPage = false;
	export let reviews = [];
	export let loadingState: Loading;
	export let settings: WidgetSettings;
	export let fetchMoreReviews: (page: number) => void;
	export let setActiveView: (view: ActiveView) => void;
	export let activeTab: ReviewsJetTab;
	export let accountPlatform: ReviewsJetPlatform;
	export let toggleReviewPictureModal: (props: { pic: string; videoUrl?: string }) => void;
	export let acceptReviews: boolean;
	export let textColor: string;
	export let submitReviewsTo: string[];
	export let submissionType: 'reviewsjet' | 'thirdparty' = 'reviewsjet';
	export let thirdpartyAccounts: ThirdpartyAccount[];
	export let showBusinessReviews: boolean;
	export let showProductReviews: boolean;
	export let siteName: string;

	let reviewsJetListContent: HTMLDivElement;
	let loadingMoreElement: HTMLParagraphElement;
	let loadMoreReviewsElement: HTMLParagraphElement;
	const {
		brandingSettings: { fontFamily, useMyWebsiteFontFamily },
		translation: { loadMoreReviews, loading },
	} = settings;

	$: if (reviewsJetListContent) {
		if (activeTab === ReviewsJetTab.PRODUCT) {
			reviewsJetListContent.style.height = '410px';
		} else if (activeTab === ReviewsJetTab.BUSINESS && !acceptReviews) {
			reviewsJetListContent.style.height = '410px';
		}
		Scrollbar.init(reviewsJetListContent);
	}

	$: if (loadMoreReviewsElement) {
		loadMoreReviewsElement.style.color = textColor;
		if (fontFamily && !useMyWebsiteFontFamily) {
			loadMoreReviewsElement.style.fontFamily = `${fontFamily}, sans-serif`;
		}
	}

	$: if (loadingMoreElement) {
		if (fontFamily && !useMyWebsiteFontFamily) {
			loadingMoreElement.style.fontFamily = `${fontFamily}, sans-serif`;
		}
	}

	const loadMore = (e: MouseEvent) => {
		e.preventDefault();
		fetchMoreReviews(page + 1);
	};
</script>

<div class="reviews-jet-list-content">
	<div
		id="scroll-content-wrapper"
		data-scrollbar="true"
		bind:this={reviewsJetListContent}
		style={`${!showBusinessReviews || !showProductReviews ? 'height: 410px;' : ''}`}
	>
		{#if reviews.length}
			{#each reviews as review}
				<Review {siteId} {review} {settings} {instanceId} {rtl} {accountPlatform} {toggleReviewPictureModal} />
			{/each}
		{:else}
			<EmptyState
				{settings}
				{setActiveView}
				{activeTab}
				{rtl}
				{submitReviewsTo}
				{thirdpartyAccounts}
				{submissionType}
				{siteName}
			/>
		{/if}

		{#if hasNextPage}
			<div class="reviews-jet-load-more-wrapper">
				{#if loadingState === Loading.PENDING}
					<p class="load-more-reviews-jet-reviews" bind:this={loadingMoreElement}>
						{loading}
					</p>
				{:else}
					<p
						class="load-more-reviews-jet-reviews"
						on:click={loadMore}
						on:keydown={() => {}}
						bind:this={loadMoreReviewsElement}
					>
						{loadMoreReviews}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style type="text/scss">
	#scroll-content-wrapper {
		height: 360px;
		overflow: hidden;
		outline: none;
	}
	.reviews-jet-list-content {
		color: #000;

		/* overflow: hidden; */
		/* outline: none; */
		.reviews-jet-load-more-wrapper {
			padding: 20px;
			text-align: center;

			.load-more-reviews-jet-reviews {
				color: #000;
				font-size: 14px;
				cursor: pointer;
				margin: 0;
			}
		}
	}

	@media (max-width: 644px) {
		.reviews-jet-list-content {
			height: 75%;
		}
		#scroll-content-wrapper {
			height: 75vh !important;
			padding-bottom: 200px;
		}
		.reviews-jet-load-more-wrapper {
			padding-bottom: 150px !important;
		}
	}
</style>
