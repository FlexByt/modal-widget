<script lang="ts">
	import EmptyStateIcon from '../../../../../shared/components/EmptyStateIcon.svelte';
	import { ActiveView } from '../../../../../shared/utils/types';
	import { removeTrailingSlash } from '../../../../../shared/utils/utils';
	import type { ThirdpartyAccount, WidgetSettings } from '../../../../../stores/settingsStore';
	import { ReviewsJetTab } from '../../../../../types';
	import getThirdPartyReviewSubmissionFormURL, {
		ReviewFormPlatform,
	} from '../../../../../utils/getThirdPartyReviewSubmissionFormURL';

	export let rtl: boolean;
	export let activeTab: ReviewsJetTab;
	export let settings: WidgetSettings;
	export let submitReviewsTo: string[];
	export let setActiveView: (view: ActiveView) => void;
	export let submissionType: 'reviewsjet' | 'thirdparty' = 'reviewsjet';
	export let thirdpartyAccounts: ThirdpartyAccount[];
	export let siteName: string;

	let reviewsJetButton: HTMLButtonElement;
	let emptyMessage: HTMLDivElement;

	const {
		translation: {
			emptyStateMessage,
			productReviewsEmptyState,
			reviewForm: { addReview },
		},
		brandingSettings: { fontFamily, useMyWebsiteFontFamily },
		modalWidget: { buttonTextColor, buttonBackgroundColor, acceptReviews },
	} = settings;

	const formLink = `${removeTrailingSlash(process.env.REVIEWJET_WEBSITE)}/w/${siteName}`;

	$: if (reviewsJetButton) {
		if (fontFamily && !useMyWebsiteFontFamily) {
			reviewsJetButton.style.fontFamily = `${fontFamily}, sans-serif`;
		}
		reviewsJetButton.style.color = buttonTextColor;
		reviewsJetButton.style.backgroundColor = buttonBackgroundColor;
	}

	$: if (emptyMessage) {
		if (fontFamily && !useMyWebsiteFontFamily) {
			emptyMessage.style.fontFamily = `${fontFamily}, sans-serif`;
		}

		if (rtl) {
			emptyMessage.style.direction = 'rtl';
		}
	}

	const handleClick = () => {
		if (submissionType === 'reviewsjet') {
			return setActiveView(ActiveView.FORM);
		}

		if (submitReviewsTo.length === 1) {
			const engine = submitReviewsTo[0] as ReviewFormPlatform;

			let thirdpartyAccount = null;

			for (let i = 0; i < thirdpartyAccounts.length; i++) {
				if (thirdpartyAccounts[i].engine === engine) {
					thirdpartyAccount = thirdpartyAccounts[i];
					break;
				}
			}

			if (thirdpartyAccount) {
				const url = getThirdPartyReviewSubmissionFormURL(engine, thirdpartyAccount);
				return window.open(url, '_blank');
			}
		} else {
			return setActiveView(ActiveView.THIRD_PARTY_PLATFORMS);
		}
	};
</script>

<div class="reviews-jet-empty-state">
	<EmptyStateIcon />
	{#if activeTab === ReviewsJetTab.BUSINESS}
		<div class="reviews-jet-empty-state-message" bind:this={emptyMessage}>
			{emptyStateMessage}
		</div>
		{#if acceptReviews}
			<button
				class="reviews-jet-button"
				bind:this={reviewsJetButton}
				on:click={() => {
					window.open(formLink, '_blank');
					// handleClick();
				}}
				on:keydown={() => {}}
			>
				{addReview}
			</button>
		{/if}
	{:else}
		<div class="reviews-jet-empty-state-message" bind:this={emptyMessage}>{productReviewsEmptyState}</div>
	{/if}
</div>

<style type="text/scss">
	.reviews-jet-empty-state {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding: 40px 50px;

		.reviews-jet-empty-state-message {
			/* width: 260px; */
			margin: 30px auto 20px;
			font-size: 14px;
			line-height: 25px;
			/* text-align: center; */
		}

		.reviews-jet-button {
			border: none;
			padding: 15px 30px;
			text-align: center;
			-webkit-transition-duration: 0.4s;
			transition-duration: 0.4s;
			text-decoration: none;
			font-size: 15px;
			cursor: pointer;
			border-radius: 25px;
			min-width: 235px;
		}
	}
</style>
