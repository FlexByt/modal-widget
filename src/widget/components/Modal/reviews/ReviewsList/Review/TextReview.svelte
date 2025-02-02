<script lang="ts">
	import { WidgetSettings } from '../../../../../../stores/settingsStore';
	import { ReviewType } from '../../../../../../types/review';

	export let review: ReviewType;
	export let settings: WidgetSettings;

	let isExpanded = false;
	let readMoreText: string;
	let showReadMore: boolean;
	const reviewLengthLimit = 40;
	let reviewMessage: string;
	let reviewTitle: HTMLParagraphElement;
	let reviewMessageElement: HTMLSpanElement;
	let readMoreElement: HTMLAnchorElement;

	const { title, content } = review;
	const {
		translation: { readLess, readMore },
		brandingSettings: { rtl },
		modalWidget: { textColor },
	} = settings;

	const originalContent = content ?? '';
	const contentWordsArr = originalContent.split(' ');

	if (contentWordsArr.length > reviewLengthLimit) {
		showReadMore = true;
		reviewMessage = `${contentWordsArr.slice(0, reviewLengthLimit).join(' ')}...`;
	} else {
		showReadMore = false;
		reviewMessage = originalContent;
	}

	const expandReview = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		isExpanded = !isExpanded;

		if (isExpanded) {
			readMoreText = readLess;
			reviewMessage = originalContent;
		} else {
			readMoreText = readMore;
			reviewMessage = `${contentWordsArr.slice(0, 20).join(' ')}...`;
		}
	};

	$: if (reviewTitle) {
		reviewTitle.style.color = textColor;
	}

	// $: if (reviewMessageElement) {
	// 	reviewMessageElement.style.color = textColor;
	// }

	$: if (readMoreElement) {
		readMoreText = readMore;
		readMoreElement.style.color = textColor;
	}
</script>

<div>
	{#if title}
		<p class="reviews-jet-title" bind:this={reviewTitle}>{title}</p>
	{/if}
	<!-- <span class="reviews-jet-content" style={rtl ? `direction: rtl; display: inline-block` : ''}>{reviewMessage}</span
  > -->
	<span
		class="reviews-jet-content"
		style={rtl ? `direction: rtl; display: inline-block` : ''}
		bind:this={reviewMessageElement}>{@html reviewMessage}</span
	>
	{#if showReadMore}
		<a
			on:click={expandReview}
			rel=""
			href="/"
			on:keydown={() => {}}
			bind:this={readMoreElement}
			style={rtl ? `direction: rtl; display: block` : ''}>{readMoreText}</a
		>
	{/if}
</div>

<style type="text/scss">
	.reviews-jet-content {
		display: inline;
		font-size: 14px;
		line-height: 25px;
		padding-top: 5px;
		color: #5e5e5e;
	}
	.reviews-jet-title {
		font-size: 14px;
		font-weight: bold;
		margin-top: 5px;
		margin-bottom: 5px;
		font-size: 15px;
		line-height: 25px;
	}
	a {
		font-size: 13px;
		text-decoration: none;
	}
	a:hover {
		cursor: pointer;
		text-decoration: underline;
	}

	:global(mark) {
		padding: 2px 3px;
		border-radius: 5px;
		color: #505050 !important;
		background-color: #fde0474d !important;
	}
</style>
