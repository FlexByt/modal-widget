<script lang="ts">
	import { ActiveView } from '../../../../../shared/utils/types';
	import { removeTrailingSlash } from '../../../../../shared/utils/utils';
	import { ThirdpartyAccount } from '../../../../../stores/settingsStore';

	export let addReview: string;
	export let fontFamily: string;
	export let buttonBackgroundColor: string;
	export let buttonTextColor: string;
	export let acceptReviews: boolean;
	export let useMyWebsiteFontFamily: boolean;
	export let setActiveView: (view: ActiveView) => void;
	export let submitReviewsTo: string[];
	export let submissionType: 'reviewsjet' | 'thirdparty' = 'reviewsjet';
	export let thirdpartyAccounts: ThirdpartyAccount[];
	export let publishedBusinessReviews: number;
	export let siteName: string;

	let addReviewButton: HTMLButtonElement;

	const formLink = `${removeTrailingSlash(process.env.REVIEWJET_WEBSITE)}/w/${siteName}`;

	$: if (addReviewButton) {
		addReviewButton.style.color = buttonTextColor;
		addReviewButton.style.backgroundColor = buttonBackgroundColor;

		if (fontFamily && !useMyWebsiteFontFamily) {
			addReviewButton.style.fontFamily = `${fontFamily}, sans-serif`;
		}
	}

	const handleClick = () => {
		window.open(formLink, '_blank');
		// if (submissionType === 'reviewsjet') {
		// 	return setActiveView(ActiveView.FORM);
		// }

		// if (submitReviewsTo.length === 1) {
		// 	const engine = submitReviewsTo[0] as ReviewFormPlatform;

		// 	let thirdpartyAccount = null;

		// 	for (let i = 0; i < thirdpartyAccounts.length; i++) {
		// 		if (thirdpartyAccounts[i].engine === engine) {
		// 			thirdpartyAccount = thirdpartyAccounts[i];
		// 			break;
		// 		}
		// 	}

		// 	if (thirdpartyAccount) {
		// 		const url = getThirdPartyReviewSubmissionFormURL(engine, thirdpartyAccount);
		// 		return window.open(url, '_blank');
		// 	}
		// } else {
		// 	return setActiveView(ActiveView.THIRD_PARTY_PLATFORMS);
		// }
	};
</script>

{#if acceptReviews && publishedBusinessReviews}
	<div class="reviews-jet-reviews-modal-footer">
		<button
			class="reviews-jet-modal-button"
			bind:this={addReviewButton}
			on:click={() => handleClick()}
			on:keydown={() => {}}
		>
			{addReview}
		</button>
	</div>
{/if}

<style type="text/scss">
	.reviews-jet-reviews-modal-footer {
		padding: 10px 25px;
		text-align: center;
		width: calc(100% - 50px);
		margin: auto;
		z-index: 9999999;
		position: absolute;
		/* background: #fff; */
		bottom: 0px;
		box-sizing: content-box;
		/* border: 1px solid red; */
		-webkit-border-bottom-right-radius: 15px;
		-webkit-border-bottom-left-radius: 15px;
		-moz-border-radius-bottomright: 15px;
		-moz-border-radius-bottomleft: 15px;
		border-bottom-right-radius: 15px;
		border-bottom-left-radius: 15px;

		.reviews-jet-modal-button {
			background-color: #000;
			color: #f7f7f7;
			min-width: 200px;
			border: none;
			padding: 10px 30px;
			text-align: center;
			-webkit-transition-duration: 0.4s;
			transition-duration: 0.4s;
			text-decoration: none;
			font-size: 15px;
			cursor: pointer;
			border-radius: 25px;
			line-height: 25px;
			/* background-color: #000;
         color: #F7F7F7;
         width: 100%;
         border: none;
         padding: 15px 0px;
         text-align: center;
         -webkit-transition-duration: 0.4s;
         transition-duration: 0.4s;
         text-decoration: none;
         font-size: 15px;
         cursor: pointer;
         border-radius: 25px; */
		}
	}
	@media (max-width: 644px) {
		.reviews-jet-modal-button {
			min-width: unset !important;
			font-size: 13px !important;
			padding: 7px 20px !important;
		}
	}
</style>
