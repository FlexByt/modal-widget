<script lang="ts">
	import dayjs from 'dayjs';
	import initials from 'initials';
	import AirbnbIcon from '../../../../../../shared/components/AirbnbIcon.svelte';
	import AliExpressIcon from '../../../../../../shared/components/AliExpressIcon.svelte';
	import AppleIcon from '../../../../../../shared/components/AppleIcon.svelte';
	import ArrowRedo from '../../../../../../shared/components/ArrowRedo.svelte';
	import CapterraIcon from '../../../../../../shared/components/CapterraIcon.svelte';
	import EtsyIcon from '../../../../../../shared/components/EtsyIcon.svelte';
	import FacebookIcon from '../../../../../../shared/components/FacebookIcon.svelte';
	import GoogleIcon from '../../../../../../shared/components/GoogleIcon.svelte';
	import LocationIcon from '../../../../../../shared/components/LocationIcon.svelte';
	import ProductHuntIcon from '../../../../../../shared/components/ProductHuntIcon.svelte';
	import ReadOnlyRating from '../../../../../../shared/components/ReadOnlyRating.svelte';
	import ThumbsUp from '../../../../../../shared/components/ThumbsUp.svelte';
	import TripadvisorIcon from '../../../../../../shared/components/TripadvisorIcon.svelte';
	import TrustPilotIcon from '../../../../../../shared/components/TrustPilotIcon.svelte';
	import YelpIcon from '../../../../../../shared/components/YelpIcon.svelte';
	import { type WidgetSettings } from '../../../../../../stores/settingsStore';
	import { ReadOnlyRatingSize, ReviewsJetPlatform } from '../../../../../../types';
	import { ReviewPlatform, ReviewType } from '../../../../../../types/review';
	import generateColorHsl from '../../../../../../utils/generateColorHsl';
	import getProductLink from '../../../../../../utils/getProductLink';
	import setAsHelpful from '../../../../../../utils/helpful';
	import getReviewerFullName from '../../../../../utils/getReviewerFullName';
	import Image from './image.svelte';
	import TextReview from './TextReview.svelte';

	export let rtl: boolean;
	export let review: ReviewType;
	export let instanceId: string;
	export let siteId: string;
	export let settings: WidgetSettings;
	export let accountPlatform: ReviewsJetPlatform;
	export let toggleReviewPictureModal: (props: { pic: string; videoUrl?: string }) => void;

	let reviewerNameElement: HTMLDivElement;
	let reviewJetRow: HTMLDivElement;
	let reviewJetAvatar: HTMLDivElement;
	let helpfulTotal = 0;
	let currentPlayingVideo = null;
	let isHelpful = false;
	let dateFormatElement: HTMLSpanElement;
	let helpfulWrapper: HTMLDivElement;

	const displayAvatar = true;

	const {
		translation: { helpful, viewProduct, verifiedReviewer, responseFromTheOwner, viewReview },
		brandingSettings: {
			fontFamily,
			dateFormat = 'DD/MM/YYYY',
			useMyWebsiteFontFamily,
			showFullName = true,
			displayLocation = false,
		},
		modalWidget: { dateColor, hideHelpfulCount, linkColor, showReviewDate, starColor = '#000', textColor },
	} = settings;
	const {
		id,
		verified,
		rating,
		reviewDate,
		reviewer,
		platform,
		helpfulCount,
		reply,
		product,
		pictures,
		link,
		location,
	} = review;

	const { content: replyContent } = reply ?? {};
	const productSlug = product?.slug;
	helpfulTotal = helpfulCount;
	const avatar = reviewer?.avatar;
	const fullName = reviewer?.fullName ?? verifiedReviewer;
	const reviewerName = getReviewerFullName(showFullName, reviewer, verifiedReviewer);
	const helpfulReviews: string[] = JSON.parse(localStorage.getItem('reviewsJet:helpful')) ?? [];
	const productUrl = getProductLink(accountPlatform, productSlug);

	let _reviewDate = reviewDate;

	try {
		_reviewDate = dayjs(reviewDate).format(dateFormat);

		if (_reviewDate === 'Invalid Date') {
			_reviewDate = reviewDate;
		}
	} catch (error) {
		_reviewDate = reviewDate;
	}

	if (helpfulReviews.includes(id)) {
		isHelpful = true;
	}

	$: if (reviewJetRow) {
		if (!useMyWebsiteFontFamily && fontFamily) {
			reviewJetRow.style.fontFamily = `${fontFamily}, sans-serif`;
		}
	}

	$: if (reviewJetAvatar) {
		if (!avatar) {
			reviewJetAvatar.textContent = initials(fullName.toUpperCase()).substring(0, 2);
			reviewJetAvatar.style.backgroundColor = generateColorHsl(fullName);
			reviewJetAvatar.style.opacity = '0.6';
		} else {
			const image = document.createElement('img');
			image.style.height = '45px';
			image.style.width = '45px';
			image.style.borderRadius = '100%';
			// image.style.border = '1px solid RGB(221, 221, 221)';
			// image.style.padding = '1px';
			image.src = avatar;
			image.style.objectFit = 'cover';

			const referrerpolicy = document.createAttribute('referrerpolicy');
			referrerpolicy.value = 'no-referrer';
			image.setAttributeNode(referrerpolicy);
			reviewJetAvatar.style.alignItems = 'flex-start';

			reviewJetAvatar.innerHTML = '';
			reviewJetAvatar.appendChild(image);
		}
	}

	$: if (reviewerNameElement) {
		reviewerNameElement.style.color = linkColor;

		if (rtl) {
			reviewerNameElement.style.direction = 'rtl';
			reviewerNameElement.style.display = 'block';
		}
	}

	$: if (dateFormatElement) {
		dateFormatElement.style.color = dateColor;

		if (fontFamily && !useMyWebsiteFontFamily) {
			dateFormatElement.style.fontFamily = `${fontFamily}, sans-serif`;
		}
	}

	$: if (helpfulWrapper) {
		helpfulWrapper.style.color = textColor;
	}

	const setReviewAsHelpful = async (id: string) => {
		let previousIds: string[] = JSON.parse(localStorage.getItem('reviewsJet:helpful')) ?? [];

		if (!previousIds.includes(id)) {
			previousIds = [...previousIds, id];
			window.localStorage.setItem('reviewsJet:helpful', JSON.stringify(previousIds));
			helpfulTotal++;
			isHelpful = true;

			await setAsHelpful(id, siteId, instanceId);
		}
	};

	function playVideo(videoElement) {
		// Pause the current video if there is one playing and it's not the selected one
		if (currentPlayingVideo && currentPlayingVideo !== videoElement) {
			currentPlayingVideo.pause();
		}

		// Play the new video
		videoElement.play();
		currentPlayingVideo = videoElement; // Update the current playing video
	}

	const displayIcon = [
		ReviewPlatform.GOOGLE,
		ReviewPlatform.YELP,
		ReviewPlatform.FACEBOOK,
		ReviewPlatform.APPLE,
		ReviewPlatform.CAPTERRA,
		ReviewPlatform.TRUSTPILOT,
		ReviewPlatform.PRODUCTHUNT,
		ReviewPlatform.TRIPADVISOR,
		ReviewPlatform.AIRBNB,
		ReviewPlatform.ETSY,
		ReviewPlatform.ALI_EXPRESS,
		ReviewPlatform.TOUR_RADAR,
	].includes(platform);
</script>

<div class="reviews-jet-row" bind:this={reviewJetRow}>
	{#if displayAvatar}
		<div class="reviews-jet-avatar-wrapper">
			<div class="reviews-jet-avatar" bind:this={reviewJetAvatar} />
		</div>
	{/if}
	<div class="reviews-jet-row-right">
		<div class="reviews-jet-reviewer-date">
			<div class="reviews-jet-reviewer">
				<div class="reviews-jet-name-wrapper" style={rtl ? `direction: rtl` : ''}>
					<div class="reviews-jet-reviewer-name" bind:this={reviewerNameElement}>
						<span>{reviewerName}</span>
						{#if displayIcon}
							<div class="reviews-jet-verified-badge" style="display: flex; ">
								{#if platform === ReviewPlatform.GOOGLE}
									<GoogleIcon />
								{/if}
								{#if platform === ReviewPlatform.YELP}
									<YelpIcon />
								{/if}
								{#if platform === ReviewPlatform.FACEBOOK}
									<FacebookIcon />
								{/if}
								{#if platform === ReviewPlatform.APPLE}
									<AppleIcon />
								{/if}
								{#if platform === ReviewPlatform.CAPTERRA}
									<CapterraIcon size={16} />
								{/if}
								{#if platform === ReviewPlatform.PRODUCTHUNT}
									<ProductHuntIcon />
								{/if}
								{#if platform === ReviewPlatform.TRUSTPILOT}
									<TrustPilotIcon />
								{/if}
								{#if platform === ReviewPlatform.TRIPADVISOR}
									<TripadvisorIcon />
								{/if}
								{#if platform === ReviewPlatform.AIRBNB}
									<AirbnbIcon />
								{/if}
								{#if platform === ReviewPlatform.ETSY}
									<EtsyIcon />
								{/if}
								{#if platform === ReviewPlatform.ALI_EXPRESS}
									<AliExpressIcon />
								{/if}
								{#if platform === ReviewPlatform.TOUR_RADAR}
									<img
										style="width: 16px; border-radius: 5px"
										src="images/tourradar.png"
										alt="Tourradar"
									/>
								{/if}
							</div>
						{/if}
						{#if location?.city && displayLocation}
							<span class="location">
								<LocationIcon />
								<span>{location.city}, {location.countryCode}</span>
							</span>
						{/if}
					</div>
				</div>
				<!-- {#if verified}
					<div class="verified-reviewer">
						{verifiedReviewer}
					</div>
				{/if} -->
			</div>
		</div>

		<div class="" style="display: flex; justify-content: space-between; align-items: center;">
			<div class="reviews-jet-review-rating">
				<ReadOnlyRating {rating} {starColor} size={ReadOnlyRatingSize.SMALL} />
			</div>
			{#if showReviewDate}
				<span style="font-size: 12px" bind:this={dateFormatElement}>{_reviewDate ?? ''}</span>
			{/if}
		</div>

		{#if review.video}
			<Image picture={review.videoPoster} {toggleReviewPictureModal} isVideoPoster videoUrl={review.video} />
		{:else}
			<TextReview {review} {settings} />
		{/if}
		{#if replyContent}
			<div class="reviewsJet-reply">
				<h4 class="reviewsJet-reply-title" style={rtl ? `direction: rtl; display: block` : ''}>
					{responseFromTheOwner}
				</h4>
				<p class="reviewsJet-reply-message" style={rtl ? `direction: rtl; display: block` : ''}>
					{replyContent}
				</p>
			</div>
		{/if}
		{#if pictures.length}
			<div class="reviewsjet-review-pics-wrapper">
				{#each pictures.slice(0, 5) as picture}
					<Image {picture} {toggleReviewPictureModal} />
				{/each}
			</div>
		{/if}
		<div style="display: flex; align-items: center; margin-top: 10px; justify-content: space-between;">
			<div>
				{#if productSlug}
					<a
						rel="noreferrer"
						href={productUrl}
						target="_blank"
						class="reviews-jet-review-source"
						style={`text-decoration: underline; ${
							rtl ? `direction: rtl; display: block; color: rgb(0, 0, 0);` : 'color: rgb(0, 0, 0);'
						}`}
					>
						{viewProduct}
						<ArrowRedo />
					</a>
				{:else if link}
					<a
						rel="noreferrer"
						href={link}
						target="_blank"
						class="reviews-jet-review-source"
						style="color: rgb(0, 0, 0);"
					>
						{platform === ReviewPlatform.ALI_EXPRESS ? viewProduct : viewReview}
						<ArrowRedo />
					</a>
				{/if}
			</div>

			{#if !hideHelpfulCount}
				<div class="reviews-jet-helpful-wrapper" bind:this={helpfulWrapper}>
					<span class="reviews-jet-helpful-icon" on:click={() => setReviewAsHelpful(id)} on:keydown={() => {}}>
						<ThumbsUp fillColor={isHelpful ? '#c5c5c5' : '#fff'} />
					</span>
					<span class="reviews-jet-helpful-span" on:click={() => setReviewAsHelpful(id)} on:keydown={() => {}}
						>{helpful}</span
					>
					<span class="reviews-jet-helpful-count">({helpfulTotal})</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style type="text/scss">
	.location {
		font-weight: 400 !important;
		color: #9e9e9e;
		font-size: 10px;
		display: flex;
		gap: 3px;
		justify-content: flex-start;
		align-items: center;
		text-transform: uppercase;
	}
	.reviews-jet-review-source {
		display: flex;
		align-items: center;
		gap: 5px;
		text-underline-offset: 5px;
		font-size: 14px;
	}
	.reviews-jet-row {
		display: flex;
		padding: 20px;
		color: #292929;
		border-bottom: 1px solid #e3e3e3;
		&:last-child {
			border: 0;
		}

		.reviewsjet-review-pics-wrapper {
			display: flex;
			gap: 10px;
			margin-top: 15px;
			flex-wrap: wrap;

			@media (max-width: 644px) {
				gap: 5px;
				max-width: 390px;
				overflow-x: auto;
			}

			img {
				cursor: pointer;
			}
		}

		@media (max-width: 300px) {
			padding: 10px;
		}
		.reviews-jet-avatar-wrapper {
			position: relative;
			height: 40px;
			.reviews-jet-verified-badge {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 100%;
				height: 18px;
				width: 18px;
				bottom: -5px;
				right: -5px;
				background-color: rgb(255, 255, 255);
				border: 2px solid rgb(255, 255, 255);
			}
		}

		.reviews-jet-avatar {
			color: #fff;
			height: 45px;
			width: 45px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			text-align: flex-start;
			font-family: Arial;
			font-size: 13px;
			font-weight: bold;
			position: relative;
			@media (max-width: 300px) {
				width: 30px;
				height: 30px;
				font-size: 12px;
			}
		}
		.reviews-jet-row-right {
			padding-left: 15px;
			flex: 2;
			.verified-reviewer {
				color: #d3a500;
				font-weight: normal;
				font-size: 13px;
				display: none;
			}
			.reviewsJet-reply {
				padding: 0 0 0 20px;
				border-left: 4px solid #dedede;
				margin-top: 10px;
				.reviewsJet-reply-title {
					font-weight: 700;
					color: #5e5e5e;
					font-size: 13px;
					margin: 0 0 5px;
				}
				.reviewsJet-reply-message {
					color: #565656;
					font-size: 13px;
					font-weight: 400;
					margin: 0;
					line-height: 20px;
				}
			}

			@media (max-width: 300px) {
				padding-left: 5px;
			}
			.reviews-jet-reviewer-date {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
			.reviews-jet-reviewer {
				/* display: flex;
            gap: 10px;
            align-items: center; */
				.reviews-jet-name-wrapper {
					display: flex;
					gap: 10px;
					align-items: center;
				}
				.reviews-jet-reviewer-name {
					color: #ba8747;
					font-weight: 700;
					font-size: 15px;
					line-height: 17px;
					display: flex;
					gap: 5px;
					justify-content: flex-start;
					margin-bottom: 5px;
					align-items: center;
				}
				/* .reviews-jet-verified-badge {
               margin-left: 3px;
               height: 15px;
               display: inline-block;
            } */
			}
			.reviews-jet-review-rating {
				display: flex;
				padding: 5px 0 10px;
			}
		}
		.reviews-jet-helpful-icon {
			width: 20px;
			height: 20px;
			margin-right: 3px;
			cursor: pointer;
		}
		.reviews-jet-helpful-wrapper {
			display: flex;
			cursor: pointer;
			justify-content: end;
			align-items: center;
			color: #000;
			-webkit-user-select: none;
			-ms-user-select: none;
			user-select: none;

			.reviews-jet-helpful-span {
				cursor: pointer;
				margin-right: 3px;
				font-size: 14px;
			}
			.reviews-jet-helpful-count {
				font-size: 13px;
			}
		}
	}
</style>
