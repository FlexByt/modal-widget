<script lang="ts">
	import BackBtn from '../../../../shared/components/BackBtn.svelte';
	import Camera from '../../../../shared/components/CameraIcon.svelte';
	import Pen from '../../../../shared/components/PenIcon.svelte';
	import { ReviewQuestionSettings, WidgetSettings } from '../../../../stores/settingsStore';
	import Questions from './questions.svelte';

	export let onBack: () => void;
	export let handleSendInText: () => void;
	export let handleSendVideo: () => void;
	export let settings: WidgetSettings;
	export let reviewQuestions: ReviewQuestionSettings;

	const { modalWidget, translation } = settings;
	const {
		reviewForm: { questions: questionsTitle, recordAVideo, sendInText },
	} = translation;
	const { collectionType, message, title, questions, status } = reviewQuestions;
</script>

<div class="wrapper">
	<div class="form-wrapper">
		<div class="preview-content">
			<BackBtn {onBack} />
			<div style="margin-bottom: 20px;" />
			<h3>{title}</h3>
			<p class="message">{message}</p>
			<Questions {status} {questions} borderColor={modalWidget.buttonBackgroundColor} title={questionsTitle} />
			<div class="buttons-wrapper">
				{#if collectionType === 'both'}
					<button
						class="video"
						on:click={handleSendVideo}
						style={`background-color: ${modalWidget.buttonBackgroundColor}; color: ${modalWidget.buttonTextColor}`}
					>
						<div class="flex">
							<Camera />
							{recordAVideo}
						</div>
					</button>
					<button class="text" on:click={handleSendInText}>
						<div class="flex">
							<Pen />
							{'sendInText'}
						</div>
					</button>
				{:else if collectionType === 'text'}
					<button class="text" on:click={handleSendInText}>
						<div class="flex">
							<Pen />
							{'sendInText'}
						</div>
					</button>
				{:else if collectionType === 'video'}
					<button
						class="video"
						on:click={handleSendVideo}
						style={`background-color: ${modalWidget.buttonBackgroundColor}; color: ${modalWidget.buttonTextColor}`}
					>
						<div class="flex">
							<Camera />
							{recordAVideo}
						</div>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style type="text/scss">
	div.wrapper {
		margin: auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		@media (max-width: 1200px) {
			padding-top: 0;
		}
		@media (max-width: 644px) {
			justify-content: flex-start;
		}
	}

	div.form-wrapper {
		display: flex;
		gap: 10px;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 0 auto;
		color: #55595f;
		border-radius: 5px;
		.preview-content {
			padding: 20px;
		}
		@media (max-width: 1200px) {
			margin: 0 !important;
			width: 100%;
		}
		h3 {
			text-align: center;
			font-size: 25px;
			line-height: 35px;
			margin-bottom: 10px;
			color: #595d6c;
			letter-spacing: -1px;
		}
		p {
			color: #707d86;
			font-size: 15px;

			&.message {
				text-align: center;
				max-width: 400px;
				margin: auto;
				margin: 15px 0 30px;
			}
		}
	}
	.buttons-wrapper {
		gap: 15px;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100%;
		margin-bottom: 25px;
		padding-top: 20px;
		button {
			width: 100%;
			padding: 10px;
			border-radius: 3px;

			&.text {
				color: #fff;
				background: #000;
			}
		}
		button {
			cursor: pointer;
			border: 0 !important;
		}
	}
	.flex {
		gap: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
