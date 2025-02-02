<script lang="ts">
	import { WidgetSettings } from '../../stores/settingsStore';

	export let reviewRating: number;
	export let reviewerName: string;
	export let settings: WidgetSettings;
	export let formInputName: HTMLInputElement;
	export let formInputEmail: HTMLInputElement;
	export let formInputRating: HTMLInputElement;

	const {
		translation: {
			reviewForm: { namePlaceHolder, nameErrorMessage, emailPlaceHolder, emailErrorMessage },
		},
		brandingSettings: { rtl },
	} = settings;
</script>

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

<style type="text/scss">
	.reviews-jet-name-email-inputs-wrapper {
		display: flex;
		flex-direction: column;
		flex: 2;

		.reviews-jet-connect-type-title {
			font-size: 12px;
			margin-bottom: 10px;
		}
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
</style>
