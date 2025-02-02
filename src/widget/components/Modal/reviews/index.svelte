<script lang="ts">
	import type { ActiveView, Loading } from '../../../../shared/utils/types';
	import type { ThirdpartyAccount, WidgetSettings } from '../../../../stores/settingsStore';
	import { ReviewsJetPlatform, ReviewsJetTab } from '../../../../types';
	import type { ReviewType } from '../../../../types/review';
	import ReviewsFooter from './ReviewsFooter/index.svelte';
	import ReviewsHeader from './ReviewsHeader/index.svelte';
	import ReviewsList from './ReviewsList/index.svelte';

	export let page: number;
	export let totalDocs: number;
	export let siteId: string;
	export let instanceId: string;
	export let hasNextPage: boolean;
	export let loadingState: Loading;
	export let businessReviews: ReviewType[];
	export let overrallRating: number;
	export let settings: WidgetSettings;
	export let accountPlatform: ReviewsJetPlatform;
	export let fetchMoreReviews: (page: number) => void;
	export let fetchMoreProductReviews: (page: number) => void;
	export let setActiveView: (view: ActiveView) => void;
	export let productReviews: ReviewType[];
	export let productReviewsPage: number;
	export let toggleReviewPictureModal: (props: { pic: string; videoUrl?: string }) => void;
	export let productReviewsHasNextPage: boolean;
	export let productReviewsTotalDocs: number;
	export let thirdpartyAccounts: ThirdpartyAccount[];
	export let publishedBusinessReviews: number;
	export let publishedProductReviews: number;
	export let totalPublishedReviews: number;
	export let siteName: string;

	$: activeTab = ReviewsJetTab.BUSINESS;
	const showReviewsAverage = true;
	const {
		translation,
		translation: {
			reviewForm: { addReview },
		},
		brandingSettings: { fontFamily, rtl, useMyWebsiteFontFamily, submissionType, submitReviewsTo },
		modalWidget: {
			acceptReviews,
			showBusinessReviews,
			showProductReviews,
			starColor = '#000',
			textColor,
			buttonTextColor,
			buttonBackgroundColor,
		},
	} = settings;

	$: if (
		showBusinessReviews ||
		(!showBusinessReviews && !showProductReviews) ||
		(showProductReviews && showBusinessReviews)
	) {
		activeTab = ReviewsJetTab.BUSINESS;
	} else if (!!showProductReviews && !showBusinessReviews) {
		activeTab = ReviewsJetTab.PRODUCT;
	}

	const toggleTabs = (tab: ReviewsJetTab) => {
		activeTab = tab;
	};
</script>

<react:Test />
<ReviewsHeader
	{rtl}
	{starColor}
	{fontFamily}
	{translation}
	{totalDocs}
	{overrallRating}
	{showReviewsAverage}
	{showProductReviews}
	{showBusinessReviews}
	{textColor}
	{toggleTabs}
	{activeTab}
	{useMyWebsiteFontFamily}
	{productReviewsTotalDocs}
	{buttonBackgroundColor}
	{publishedBusinessReviews}
	{publishedProductReviews}
	{totalPublishedReviews}
/>
{#if activeTab === ReviewsJetTab.BUSINESS}
	<ReviewsList
		{rtl}
		{siteId}
		{settings}
		{instanceId}
		reviews={businessReviews}
		{page}
		{hasNextPage}
		{loadingState}
		{fetchMoreReviews}
		{setActiveView}
		{activeTab}
		{toggleReviewPictureModal}
		{acceptReviews}
		{textColor}
		{accountPlatform}
		{submitReviewsTo}
		{thirdpartyAccounts}
		{submissionType}
		{showBusinessReviews}
		{showProductReviews}
		{siteName}
	/>
	{#if totalDocs}
		<ReviewsFooter
			{buttonTextColor}
			{addReview}
			{buttonBackgroundColor}
			{fontFamily}
			{setActiveView}
			{acceptReviews}
			{useMyWebsiteFontFamily}
			{submissionType}
			{submitReviewsTo}
			{thirdpartyAccounts}
			{publishedBusinessReviews}
			{siteName}
		/>
	{/if}
{:else if activeTab === ReviewsJetTab.PRODUCT}
	<ReviewsList
		{rtl}
		{siteId}
		{settings}
		{instanceId}
		reviews={productReviews}
		page={productReviewsPage}
		hasNextPage={productReviewsHasNextPage}
		{loadingState}
		fetchMoreReviews={fetchMoreProductReviews}
		{setActiveView}
		{activeTab}
		{toggleReviewPictureModal}
		{acceptReviews}
		{textColor}
		{accountPlatform}
		{submitReviewsTo}
		{thirdpartyAccounts}
		{submissionType}
		{showBusinessReviews}
		{showProductReviews}
		{siteName}
	/>
{/if}
