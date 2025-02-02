<script lang="ts">
	import initials from 'initials';
	import BackButton from '../../../../shared/components/BackBtn.svelte';
	import DeleteIcon from '../../../../shared/components/DeleteIcon.svelte';
	import LoadingGif from '../../../../shared/components/Loading.svelte';
	import PlusIcon from '../../../../shared/components/PlusIcon.svelte';
	import { ActiveView, Loading } from '../../../../shared/utils/types';
	import { removeTrailingSlash } from '../../../../shared/utils/utils';
	import type { ReviewQuestionSettings, WidgetSettings } from '../../../../stores/settingsStore';
	import generateColorHsl from '../../../../utils/generateColorHsl';
	import Questions from '../review-questions/questions.svelte';
	import Rating from './Rating.svelte';

	type ReviewsJetFormData = HTMLFormControlsCollection & {
		rating: { value: string };
		name: { value: string };
		email: { value: string };
		message: { value: string };
		title: { value: string };
	};

	export let siteId: string;
	export let onBack: () => void;
	export let instanceId: string;
	export let campaignId: string;
	export let settings: WidgetSettings;
	export let setActiveView: (view: ActiveView) => void;
	export let publicIpAddress: string;
	export let reviewQuestions: ReviewQuestionSettings;

	let reviewerName = '';
	let reviewRating = 5;
	let form: HTMLFormElement;
	let formButton: HTMLButtonElement;
	let formTextArea: HTMLTextAreaElement;
	let formInputName: HTMLInputElement;
	let formInputEmail: HTMLInputElement;
	let formInputTitle: HTMLInputElement;
	let formInputRating: HTMLInputElement;
	let uploading: Loading = Loading.INITIAL;
	let submittingForm: Loading = Loading.INITIAL;
	let cancelReviewSubmission: HTMLAnchorElement;

	const displayAvatar = true;
	const {
		translation: {
			pleaseWait,
			reviewForm: {
				cancel,
				messagePlaceholder,
				namePlaceHolder,
				nameErrorMessage,
				emailPlaceHolder,
				emailErrorMessage,
				profilePicture,
				clickHereToUpload,
				submitButtonText,
				enterReviewTitle,
				questions: questionsTitle,
			},
		},
		brandingSettings: { fontFamily, rtl, useMyWebsiteFontFamily },
		modalWidget,
		modalWidget: { textColor, buttonTextColor, buttonBackgroundColor },
	} = settings;

	const { questions, status } = reviewQuestions;

	const changeRating = (value: number) => {
		reviewRating = value;
	};

	let avatar: string, fileinput: HTMLInputElement;

	const onFileSelected = async (e: any) => {
		try {
			let image = e.target.files[0];
			let formData = new FormData();
			formData.append('file', image);
			formData.append('remotePath', 'avatars');
			formData.append('instanceId', instanceId);
			formData.append('siteId', siteId);

			uploading = Loading.PENDING;
			const response = await (
				await fetch(`${removeTrailingSlash(process.env.REVIEWS_JET_API)}/widget/upload-image`, {
					method: 'POST',
					body: formData,
				})
			).json();
			avatar = response.url;
			uploading = Loading.SUCCESS;
		} catch (error) {
			uploading = Loading.ERROR;
		}
	};

	const deleteFile = () => {
		fileinput.value = '';
		uploading = Loading.INITIAL;
	};

	const submitReview = async (
		e: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		e.preventDefault();
		const url = `${removeTrailingSlash(process.env.REVIEWS_JET_API)}/widget/reviews/create`;

		if (e.target instanceof HTMLFormElement) {
			const elements = e.target.elements as ReviewsJetFormData;
			const {
				rating: { value: ratingValue },
				name: { value: nameValue },
				email: { value: emailValue },
				message: { value: messageValue },
				title: { value: titleValue },
			} = elements;

			let payload = {
				name: nameValue,
				email: emailValue,
				rating: ratingValue,
				message: messageValue,
				instanceId,
				campaignId,
				siteId,
				title: titleValue,
				publicIpAddress,
			} as {
				name: string;
				email: string;
				rating: string;
				message: string;
				avatar?: string;
				instanceId: string;
				campaignId: string;
				siteId: string;
				title: string;
				publicIpAddress?: string | null;
			};

			if (avatar) {
				payload = { ...payload, avatar };
			}

			try {
				submittingForm = Loading.PENDING;
				await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
				formTextArea.value = '';
				formInputName.value = '';
				formInputEmail.value = '';
				formInputTitle.value = '';

				changeRating(3);
				submittingForm = Loading.SUCCESS;
				setActiveView(ActiveView.THANK_YOU);
			} catch {
				submittingForm = Loading.ERROR;
			}
		}
	};

	$: if (form && formTextArea && formInputName && formInputEmail && formButton) {
		if (fontFamily && !useMyWebsiteFontFamily) {
			form.style.fontFamily = `${fontFamily}, sans-serif`;
			formTextArea.style.fontFamily = `${fontFamily}, sans-serif`;
			formInputName.style.fontFamily = `${fontFamily}, sans-serif`;
			formInputEmail.style.fontFamily = `${fontFamily}, sans-serif`;
			formButton.style.fontFamily = `${fontFamily}, sans-serif`;
			formInputTitle.style.fontFamily = `${fontFamily}, sans-serif`;
		}
		formButton.style.backgroundColor = buttonBackgroundColor;
		formButton.style.color = buttonTextColor;
	}
	$: if (cancelReviewSubmission) {
		cancelReviewSubmission.style.color = textColor;
	}
</script>

<form
	class="reviews-jet-form-wrapper"
	style="display: flex;"
	autocomplete="off"
	bind:this={form}
	on:submit={submitReview}
>
	{#if status}
		<BackButton {onBack} />
		<div style="margin-bottom: 20px;" />
	{/if}
	<Questions {questions} {status} borderColor={modalWidget.buttonBackgroundColor} title={questionsTitle} />
	<div class="reviews-jet-new-review-stars-wrapper">
		<Rating {reviewRating} {changeRating} id="reviewsjet-site-widget" />
	</div>

	<div class="reviews-jet-name-email-inputs-wrapper">
		<input
			class="reviews-jet-form-input"
			style={rtl ? `direction: rtl; display: block` : ''}
			bind:this={formInputTitle}
			placeholder={enterReviewTitle}
			id="reviews-jet-title"
			name="title"
			type="text"
			on:invalid={() => formInputName.setCustomValidity(nameErrorMessage)}
			on:change={() => formInputName.setCustomValidity('')}
		/>
	</div>

	<textarea
		style={rtl ? `direction: rtl; display: block;font-family: sans-serif` : 'font-family: sans-serif'}
		class="reviews-jet-form-input reviews-jet-message"
		bind:this={formTextArea}
		placeholder={messagePlaceholder}
		name="message"
	/>
	<div class="reviews-jet-form-middle-wrapper">
		<div style="display: none;">
			<span class="reviews-jet-connect-type-title">Connect with</span>
			<div class="reviews-jet-social-media-icons-wrapper">
				<span class="reviews-jet-facebook-icon" /><span class="reviews-jet-twitter-icon" />
			</div>
		</div>
		<div class="reviews-jet-or-div" style="display: none;">-OR-</div>
		<div class="reviews-jet-name-email-inputs-wrapper">
			<input
				class="reviews-jet-form-input"
				style={rtl ? `direction: rtl; display: block` : ''}
				bind:this={formInputName}
				bind:value={reviewerName}
				placeholder={namePlaceHolder}
				id="reviews-jet-fullname"
				name="name"
				required={true}
				type="text"
				on:invalid={() => formInputName.setCustomValidity(nameErrorMessage)}
				on:change={() => formInputName.setCustomValidity('')}
			/>
			<input
				class="reviews-jet-form-input"
				style={rtl ? `direction: rtl; display: block` : ''}
				bind:this={formInputEmail}
				placeholder={emailPlaceHolder}
				id="reviews-jet-email"
				name="email"
				required={true}
				type="email"
				on:invalid={() => formInputEmail.setCustomValidity(emailErrorMessage)}
				on:change={() => formInputEmail.setCustomValidity('')}
			/>
		</div>
		<input type="hidden" name="rating" value={reviewRating} bind:this={formInputRating} />
	</div>

	{#if displayAvatar}
		<div
			style={rtl ? `direction: rtl;` : ''}
			class="reviewsjet-form-profile-pic-section"
			on:click={() => {
				if (uploading === Loading.INITIAL) {
					fileinput.click();
				}
			}}
			on:keydown={() => {}}
		>
			{#if uploading === Loading.SUCCESS}
				<div class="reviewsjet-avatar-preview">
					<img class="avatar" src={avatar} alt="ReviewsJet" />
					<div class="reviewsjet-delete-icon-wrapper" on:click={() => deleteFile()} on:keydown={() => {}}>
						<DeleteIcon />
					</div>
				</div>
			{:else}
				<div
					class="reviewsjet-plus-wrapper"
					style={`color: #fff; opacity: ${reviewerName ? 0.6 : 1}; background-color: ${
						!reviewerName || uploading === Loading.PENDING ? '#e5e5ec' : generateColorHsl(reviewerName ?? '')
					}`}
				>
					{#if uploading === Loading.PENDING}
						<LoadingGif />
					{:else if reviewerName}
						{initials(reviewerName ?? '')
							.substring(0, 2)
							.toUpperCase()}
					{:else}<PlusIcon />
					{/if}
				</div>
			{/if}
			<div>
				<div>
					<span class="reviewsjet-profile-picture-label" style={rtl ? `direction: rtl; display: block` : ''}
						>{profilePicture}</span
					>
				</div>
				<div>
					<span style={rtl ? `direction: rtl; display: block` : ''}>
						{clickHereToUpload}
					</span>
				</div>
			</div>
			<input
				style="display:none"
				type="file"
				accept=".jpg,.jpeg,.png,.webp"
				on:change={(e) => onFileSelected(e)}
				bind:this={fileinput}
			/>
		</div>
	{/if}

	<div class="footer">
		<a
			href="/"
			class="reviews-jet-form-cancel-link"
			bind:this={cancelReviewSubmission}
			on:keydown={() => {}}
			on:click={(e) => {
				e.preventDefault();
				setActiveView(ActiveView.REVIEWS);
			}}>{cancel}</a
		>
		<button
			disabled={submittingForm === Loading.PENDING}
			class="reviews-jet-form-submit-button reviews-jet-button"
			type="submit"
			bind:this={formButton}
		>
			{#if submittingForm === Loading.PENDING}
				{pleaseWait}
			{:else}
				{submitButtonText}
			{/if}
		</button>
	</div>
</form>

<style type="text/scss">
	.footer {
		display: flex;
		gap: 15px;
		align-items: center;
		justify-content: flex-end;
		padding-top: 25px;
	}
	.reviews-jet-form-wrapper {
		color: #000;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.reviews-jet-form-title {
			font-weight: 700;
			font-size: 20px;
			line-height: 22px;
			color: #000;
			text-align: center;
			width: 100%;
			display: block;
		}
		.reviews-jet-form-input {
			padding: 10px 20px;
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			line-height: 19px;
			background: #f5f5f5;
			border-radius: 10px;
			border: 1px solid transparent;
			outline: none !important;
			margin-bottom: 10px;
			font-size: 14px;
		}
		.reviews-jet-message {
			height: 120px;
			resize: none;
		}

		.reviews-jet-form-middle-wrapper {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.reviews-jet-form-submit-button {
			color: #f7f7f7;
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

		.reviews-jet-form-cancel-link {
			text-align: center;
			font-size: 15px;
			font-weight: 400;
			line-height: 20px;
			cursor: pointer;
			width: fit-content;
			text-decoration: none;
			color: #000;
		}

		.reviews-jet-form-cancel-link:hover {
			text-decoration: underline;
		}

		.reviews-jet-new-review-stars-wrapper {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 15px;
			padding: 10px 0;
		}

		.reviews-jet-name-email-inputs-wrapper {
			display: flex;
			flex-direction: column;
			flex: 2;

			.reviews-jet-connect-type-title {
				font-size: 12px;
				margin-bottom: 10px;
			}
		}

		@media (max-width: 375px) {
			.reviews-jet-message {
				height: 60px;
			}
		}
		.reviewsjet-form-profile-pic-section {
			font-size: 12px;
			display: flex;
			gap: 16px;
			padding: 8px;
			border-radius: 10px;
			background-color: #f5f5f5;
			align-items: center;
			cursor: pointer;
			&:hover {
				background-color: #ececec;
			}

			.reviewsjet-avatar-preview {
				width: 40px;
				height: 40px;
				text-align: center;
				position: relative;

				img {
					width: 40px;
					object-fit: cover;
					border-radius: 50%;
					height: 40px;
				}
				.reviewsjet-delete-icon-wrapper {
					position: absolute;
					top: -10px;
					right: -10px;
					width: 15px;
					height: 15px;
					background: #000;
					border: 1px solid #fff;
					border-radius: 50%;
					cursor: pointer;
					&:hover {
						width: 18px;
						height: 18px;
					}
				}
			}

			.reviewsjet-plus-wrapper {
				width: 20px;
				height: 40px;
				background: #e5e5ec;
				padding: 0 10px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				box-sizing: initial;
				text-align: center;
				border-radius: 100%;
			}

			.reviewsjet-profile-picture-label {
				color: #384b57;
				font-size: bold;
			}
		}
	}
</style>
