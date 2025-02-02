<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Loading } from '../shared/utils/types';
	import settingsStore, { Plan, ThirdpartyAccount, WidgetSettings } from '../stores/settingsStore';
	import { ReviewsJetPlatform } from '../types';
	import type { ReviewType } from '../types/review';
	import getOverralSiteRating from '../utils/getOverralSiteRating';
	import Modal from './components/Modal/index.svelte';
	import ReviewPicModal from './components/ReviewPicModal/index.svelte';
	import getReviews from './utils/getSiteReviews';

	export let siteId: string;
	export let openForm: boolean;
	export let instanceId: string;
	export let campaignId: string;

	let page = 1;
	let totalDocs = 1;
	let innerWidth = 0;
	let accountPlan: Plan;
	let accountPlatform: ReviewsJetPlatform;
	let overrallRating = 0;
	let businessReviews: ReviewType[] = [];
	let productReviews: ReviewType[] = [];
	let showModal = openForm;
	let hasNextPage = false;
	let settings: WidgetSettings;
	let loadingReviewsState: Loading;
	let loadingSettingsState: Loading;
	let loadingReviews = Loading.INITIAL;
	let productReviewsPage = 1;
	let productReviewsTotalDocs = 1;
	let productReviewsHasNextPage = false;
	let selectedReviewPicture: string | null = null;
	let thirdpartyAccounts: ThirdpartyAccount[];
	let totalPublishedReviews = 1;
	let publishedBusinessReviews = 1;
	let publishedProductReviews = 1;
	let publicIpAddress = null;
	let reviewVideo = null;
	let _siteName = null;

	$: isMobile = innerWidth <= 644;

	const SettingsStore = settingsStore({ instanceId, siteId });
	const unsubscribeSettingsStore = SettingsStore.subscribe((data) => {
		const {
			widgetSettings,
			loading,
			plan,
			platform,
			thirdpartyAccounts: sources,
			publicIpAddress: _publicIpAddress,
			siteName,
		} = data;

		if (widgetSettings) {
			settings = widgetSettings;
			accountPlan = plan;
			thirdpartyAccounts = sources;
			loadingSettingsState = loading;
			accountPlatform = platform;
			publicIpAddress = _publicIpAddress;
			_siteName = siteName;
		}
	});

	const toggleModal = () => {
		if (showModal) {
			document.body.style.overflow = '';
		} else {
			document.body.style.overflow = 'hidden';
		}
		showModal = !showModal;
	};

	const toggleReviewPictureModal = ({ pic, videoUrl }: { pic: string | null; videoUrl?: string }) => {
		reviewVideo = videoUrl;
		selectedReviewPicture = pic;
	};

	const fetchMoreReviews = async (nextPage: number) => {
		loadingReviews = Loading.PENDING;

		const response = await getReviews({ instanceId, nextPage, siteId });

		businessReviews = [...businessReviews, ...response.docs];
		page = response.page;
		loadingReviews = Loading.SUCCESS;
		hasNextPage = response.hasNextPage;
	};

	const fetchMoreProductReviews = async (nextPage: number) => {
		loadingReviews = Loading.PENDING;

		const response = await getReviews({
			instanceId,
			nextPage,
			reviewType: 'product',
			siteId,
		});

		productReviews = [...productReviews, ...response.docs];
		productReviewsPage = response.page;
		loadingReviews = Loading.SUCCESS;
		productReviewsHasNextPage = response.hasNextPage;
	};

	onMount(async () => {
		loadingReviewsState = Loading.PENDING;
		const [
			reviewsResponse,
			{
				averageRating,
				totalPublishedReviews: _totalPublishedReviews,
				publishedBusinessReviews: _publishedBusinessReviews,
				publishedProductReviews: _publishedProductReviews,
			},
			allProductReviews,
		] = await Promise.all([
			getReviews({ instanceId, siteId }),
			getOverralSiteRating({ instanceId, siteId }),
			getReviews({ instanceId, reviewType: 'product', siteId }),
		]);
		businessReviews = reviewsResponse.docs;
		page = reviewsResponse.page;
		totalDocs = totalPublishedReviews;
		hasNextPage = reviewsResponse.hasNextPage;
		overrallRating = averageRating;
		loadingReviewsState = Loading.SUCCESS;
		productReviews = allProductReviews.docs;
		productReviewsPage = allProductReviews.page;
		productReviewsHasNextPage = allProductReviews.hasNextPage;
		productReviewsTotalDocs = allProductReviews.totalDocs;
		// productsAverageRatings = allProductsAverageRatings;
		totalPublishedReviews = _totalPublishedReviews;
		publishedBusinessReviews = _publishedBusinessReviews;
		publishedProductReviews = _publishedProductReviews;
	});

	onDestroy(() => {
		unsubscribeSettingsStore();
	});
</script>

<svelte:window bind:innerWidth />

{#if loadingSettingsState === Loading.SUCCESS}
	<main class="stop-scrolling">
		{#if selectedReviewPicture}
			<ReviewPicModal {selectedReviewPicture} {toggleReviewPictureModal} {reviewVideo} />
		{/if}

		{#if showModal}
			<Modal
				{isMobile}
				{siteId}
				{openForm}
				{accountPlan}
				{settings}
				{accountPlatform}
				{instanceId}
				{page}
				{hasNextPage}
				{totalDocs}
				{fetchMoreReviews}
				{toggleModal}
				{overrallRating}
				{loadingReviews}
				{businessReviews}
				{productReviews}
				{productReviewsPage}
				{productReviewsHasNextPage}
				{fetchMoreProductReviews}
				{campaignId}
				{toggleReviewPictureModal}
				{productReviewsTotalDocs}
				{thirdpartyAccounts}
				{publishedBusinessReviews}
				{publishedProductReviews}
				{totalPublishedReviews}
				{publicIpAddress}
				siteName={_siteName}
			/>
		{/if}
	</main>
{/if}

<style type="text/scss">
	@font-face {
		font-family: 'Arimo';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=P5sfzZCDf9_T_3cV7NCUECyoxNk37cxsAhDAVQMwaIYdvFQVefj5Jm3zVop4sQui3RjhybAgky1_aiYjBZdjROFH_WIWBlk6ZvGriCg&skey=6457c0ab3b693f57&v=v29)
			format('woff2');
	}
	@font-face {
		font-family: 'Barlow';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=7cHpv4kjgoGqM7EPDsE-6HobsR9iNPL4eLfy79CY6FUEGeo8oEJQ6rLwsKKPKhjuAeuPhQ25GOUcDTcn1GP0&skey=32d7acf8757dbad0&v=v12)
			format('woff2');
	}
	@font-face {
		font-family: 'Bebas Neue';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=JTUSjIg69CK48gW7PXooxWtrzAbjyfpV5Wng7yp5ATYe6Pb1dvab5t8YI0TgtdHhVaxOlLGQdABaiCP8lYXUWiBvnA&skey=6bd981f07b300212&v=v14)
			format('woff2');
	}
	@font-face {
		font-family: 'DM Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhS2f3ZGIRpuAU13zrLAOpSFPmdGEq8GES6IKGZONAuogN774yRs1Hn1gTGqZ1fGp1HKCqBaA&skey=cd068b3e1b767e51&v=v14)
			format('woff2');
	}
	@font-face {
		font-family: 'Dosis';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=HhyJU5sn9vOmLxNkIwRSjTVNWLEJN7MV2RkFTq8MP4rLA4TR7XkN1zT6OXEsLbQy4wvGLVrdURpdKajFugPZJBWrKZK2SObD6EYyiGU&skey=91e90d677384bade&v=v32)
			format('woff2');
	}
	@font-face {
		font-family: 'Fira Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=va9E4kDNxMZdWfMOD5VflYLMSTfNWHyP1QmSWz6AwflDA_2ArFFDOdQ0brV_-dmWvG7AM1homLKXYrZDu-NJ-_TK&skey=6bde03e5f15b0572&v=v17)
			format('woff2');
	}
	@font-face {
		font-family: 'Heebo';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=NGSpv5_NC0k9P_v6ZUCbLRAHxK1EiSycd0Onz0yaXTx7iO9efKT-bfp8WaCyjot_BNOzivOWc4xOPnxAwFS8CnAXbVfrg7QVs-uHHgQ&skey=878db4aed11f133b&v=v22)
			format('woff2');
	}
	@font-face {
		font-family: 'IBM Plex Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=zYXgKVElMYYaJe8bpLHnCwDKtdPUEo5MQ_vLTyk-tXoeQcqyTsIsMpvTc0gAVN1q_-XNj4W5fTz2gsNg1xuLiQ2ZjfiOaA&skey=db4d85f0f9937532&v=v19)
			format('woff2');
	}
	@font-face {
		font-family: 'Inconsolata';
		font-style: normal;
		font-weight: 400;
		font-stretch: 100%;
		src: url(https://fonts.gstatic.com/l/font?kit=QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8aR_8lleZ0cqrIVyfp6bc4Qdam9pFbWaXy-LvcTm2IFWzHknI2vFAQZm_b0DgyXhCyscYxfNe&skey=20fa6569a31c71ee&v=v32)
			format('woff2');
	}
	@font-face {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZ1rib2Ai-7mVRHMW8QOaSF3-WNlNLh3TnFRJruU5ZwY6nNG-WCfKLFuGjDBwiz2BlyZ1CQ6&skey=c491285d6722e4fa&v=v13)
			format('woff2');
	}
	@font-face {
		font-family: 'Josefin Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_DjQXMRrLgTtSV3mPLL2HLyQi7OKQhO6wroOgEXxU-fS7TE9kBRV0J86VfzOjqN-pbDIUz8EayEF&skey=22ddf758bcf1d5cd&v=v32)
			format('woff2');
	}
	@font-face {
		font-family: 'Kanit';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=nKKZ-Go6G5tXcoaXEQeodZZtFBsxWau4f-Az4vNxl8v23dGe9gXFBvo6qDlpiM3XU9pJVPAvl3heO3iDVHU&skey=f700248af71fb487&v=v15)
			format('woff2');
	}
	@font-face {
		font-family: 'Karla';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=qkBIXvYC6trAT55ZBi1ueQVIjQTD-JqqEUNLR7bPGzu80pc2AXTcLAFj7jsWAlJPIyXlXToWtKvfadlQLaOqFRdHFL7nrBnAC3AHpP8&skey=139a38ebe1800a84&v=v31)
			format('woff2');
	}
	@font-face {
		font-family: 'Lato';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=S6uyw4BMUTPHvxw6WQevLgvIrJ92qrIfnoePR8Pgdht4CYNeemZMU7vauU0Qj_3jqGdZuSK7HcrrG8VHtA&skey=2d58b92a99e1c086&v=v24)
			format('woff2');
	}
	@font-face {
		font-family: 'Libre Baskerville';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=kmKnZrc3Hgbbcjq75U4uslyuy4kn0pNbYRQ4Cfe44vrhegl0TmsD_KmWMe5Q6NeZHOTEcT4gw5AHP96fk8FUrPdQKKkP-wGMzZU&skey=1ccff9706b4dcbb3&v=v14)
			format('woff2');
	}
	@font-face {
		font-family: 'Libre Franklin';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=jizOREVItHgc8qDIbSTKq4XkRg8T88bjFuXOnduhLsWUAtrIb-NP1uupVUyj073W0BFFIT2RatHd94agftfF_s3EfGgoLTb1kjym5vPZlnsHy0B6Zpo&skey=c27c9a4f66e66f55&v=v14)
			format('woff2');
	}
	@font-face {
		font-family: 'Lora';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=0QI6MX1D_JOuGQbT0gvTJPa787weuyJDmKxemc-Z57CRDk1X6DMTNfBR9JQEEsthRvOoOXSwaBfLqx7cFvCVpFn-sadIXzQd_tD1nQ&skey=1d294b6d956fb8e&v=v32)
			format('woff2');
	}
	@font-face {
		font-family: 'Manrope';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_A87jxedbBOJuRgErW4zIjoUJQsMvuIx8iMeRYxVfMjDW9iFQlPf0hMRNnwr-fM2cdpGV6jQ&skey=c397ded15edc0853&v=v15)
			format('woff2');
	}
	@font-face {
		font-family: 'Material Icons';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tavMb-5IIyLBSkzYpmaW7UXn8JkuaxGKoCjUhV3cX90MaEfORDOvZXSpQwEqks0&skey=4fbfe4498ec2960a&v=v140)
			format('woff2');
	}
	@font-face {
		font-family: 'Material Icons Outlined';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcel5euIkxzPW-DMmD4gC7Yrm0l7eApeSbx7Ekd_ZTtvO_8FvqxioZ4VuJVmnlPRnCN7OE&skey=dbde49387d8fd363&v=v109)
			format('woff2');
	}
	@font-face {
		font-family: 'Material Symbols Outlined';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOejbd5zrDAt6_k43va-2-iWKsUSSh98PurLaQTO9ZpMxZ8Hgu7kFzxxWYJYrW2FdwjY9pcW4Q&skey=b8dc2088854b122f&v=v156)
			format('woff2');
	}
	@font-face {
		font-family: 'Merriweather';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=u-440qyriQwlOrhSvowK_l5OfixLV-fNgtmofz7CRd452N-MQ_zLjTa7Wan5UrvcyzrGg0aDfw9mfhOfUoahFMKyDQTC&skey=379c1eccf863c625&v=v30)
			format('woff2');
	}
	@font-face {
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew7Y3tco6q5CpXr9s8IM1fwnPrIeoVlsperST9nswbZh5PCSDJxjeDJee-atp5_cCvNjQSL-Q&skey=7bc19f711c0de8f&v=v26)
			format('woff2');
	}
	@font-face {
		font-family: 'Mukta';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=iJWKBXyXfDDVXYnDp3uS0VfyzMk8jI_TFy15FcyB3MsAa_z2ND1Gr6T_MDhL4Vk9Ln-fuxYcReFHMaemK1o&skey=1924b0eeab402e18&v=v14)
			format('woff2');
	}
	@font-face {
		font-family: 'Mulish';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=1Ptyg83HX_SGhgqO0yLcmjzUAuWexZNRwaWlGrw_NTZv7e7kI2IDxkZAlcLdODnC0EtRQTu3T92KQY2Aa1JQvVJ96QudgA0cgpoRyw2X&skey=9f5b077cc22e75c7&v=v13)
			format('woff2');
	}
	@font-face {
		font-family: 'Nanum Gothic';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=PN_3Rfi-oW3hYwmKDpxS7F_z-9LZxnsR86ddEp5V-JdY1smZDqPnutxeqyuufHYviSZ9Z2a9FwaqfcvdGPooMEGn9zMK&skey=e63963c7c3a19959&v=v23)
			format('woff2');
	}
	@font-face {
		font-family: 'Noto Sans';
		font-style: normal;
		font-weight: 400;
		font-stretch: 100%;
		src: url(https://fonts.gstatic.com/l/font?kit=o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99Y41P6zXNY_J-Ot9nWKFAkoM2iUP3rvtHXuy8uMtsI8cuvt6-npblLTNoJqL_5uH_sSnM22w&skey=2b960fe17823056f&v=v35)
			format('woff2');
	}
	@font-face {
		font-family: 'Noto Sans JP';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj757Y0rw_qMGlTZ4nB-QJZhtYFSYFsTZuiJE9Xewy6woKaLoMMPWrJyDEw5Pdy8O0blXkCz1a&skey=72472b0eb8793570&v=v52)
			format('woff2');
	}
	@font-face {
		font-family: 'Noto Sans KR';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLHq8H4gdeHKTHQJ9Q3Tgvq0Ydcw0V32vVszEi2zgHg1cUYtGhZ2wAiOD4SN2HHhXvWqBL63&skey=87e7ee645936e2c7&v=v36)
			format('woff2');
	}
	@font-face {
		font-family: 'Noto Sans SC';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYlNbPzT7HF73BctbQmuEoMZaSVe9hF-mD9DXfTdDM8huRc153R3s_ZF2jKznlf1XVt0kI4G&skey=cf0bb10b5602fdc3&v=v36)
			format('woff2');
	}
	@font-face {
		font-family: 'Noto Sans TC';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz76Cy_C9Otma2sNT5hBxdoB2UDv7E4Dnomkui2kopmZjtCqXytXoEMAN_n0jS1CDk7hKEY6cChQY7&skey=3904269dc8bdd0a1&v=v35)
			format('woff2');
	}
	@font-face {
		font-family: 'Noto Serif';
		font-style: normal;
		font-weight: 400;
		font-stretch: 100%;
		src: url(https://fonts.gstatic.com/l/font?kit=ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZqFCjxc0Lhq7azw8PLeDqEYgnn0OtAvH5DwWO_Aj2uONAWFcCtCF0HWnvOfcUkZTi-RU5Pg5Oli8&skey=ff3f102bd67fc93c&v=v23)
			format('woff2');
	}
	@font-face {
		font-family: 'Nunito';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=XRXI3I6Li01BKofiOc5wtlZ2di8HDLshRTY9jo7fRWnCV-y5Sx9vlDbMm2mDQq4UB7vDIYuwEiM2LOL_24xvIV44nFzJUujnaIdMZymU&skey=27bb6aa8eea8a5e7&v=v26)
			format('woff2');
	}
	@font-face {
		font-family: 'Nunito Sans';
		font-style: normal;
		font-weight: 400;
		font-stretch: 100%;
		src: url(https://fonts.gstatic.com/l/font?kit=pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4G1ilnsV8kA_csqz9w89jf6jkmSptH4F9LKMEVXuLIZlHPLLJjdz-QHWms5J1mjA4bIFkpg7ZVs3w&skey=60bfdc605ddb00b1&v=v15)
			format('woff2');
	}
	@font-face {
		font-family: 'Oswald';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvgURoZAaQniG1LQyVEDoVe8quPt5u1qLjBpNKaOZpyOpobIgxp6pS-WAef_9-J5TfQZ0VCtIG&skey=653237e53512d0de&v=v53)
			format('woff2');
	}
	@font-face {
		font-family: 'PT Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=jizaRExUiTo99u79P0COwuGNGhk4unBwzxiOwJLrrcr5Sb-cNrEMg4zSFG-C9Jz2_zBnBxuzSO_g1KOHW_To0A&skey=fd0b32f0f3e6a1fc&v=v17)
			format('woff2');
	}
	@font-face {
		font-family: 'PT Serif';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=EJRVQgYoZZY2vCFuvDFUxLiddxzThYoCs8nc6WT0VOqVguyLF1HsbqjkKlMse5x9E1sWmhXJRK04O_L87n8ttYA&skey=e37119e9cd703ddf&v=v18)
			format('woff2');
	}
	@font-face {
		font-family: 'Playfair Display';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDVZNLo_EWrKWa0U-qqM92jLwRS4PDrcPg1QkvL7Av3Vgcb7Xcel5wcczqLE3NCsq3bKXnSOQ&skey=f3b68f0152604ed9&v=v36)
			format('woff2');
	}
	@font-face {
		font-family: 'Poppins';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=pxiEyp8kv8JHgFVrFJXUdVNFIturCQsH7ijv7rsFwj3kj24ugePH1y0lxEZu3kKT20BMsou3JHRRRqRjTJSQ6w&skey=87759fb096548f6d&v=v20)
			format('woff2');
	}
	@font-face {
		font-family: 'Quicksand';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o18S0wx41SDykOs4cNMlr6FRid9FOqLtiHdPiMVm6FWLWfnsWB3WfOnqmuK_8JWWFZOJPRa4z&skey=c01f11fa5439d932&v=v31)
			format('woff2');
	}
	@font-face {
		font-family: 'Raleway';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCKNLA3JSdc8-KFIGMExEdPlMHcPzjB0VRQQjqwTt-8QoyHalFevFB66Aicnw8dhZsSygKW0Q&skey=30a27f2564731c64&v=v29)
			format('woff2');
	}
	@font-face {
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=KFOmCnqEu92Fr1Me4GZNCzcPBuGz18sKPTz8SBNUL3mWFbZdfBrH_Vi_9D9CugleuhAbgKmvNYKZN1VNR7P9&skey=a0a0114a1dcab3ac&v=v30)
			format('woff2');
	}
	@font-face {
		font-family: 'Roboto Condensed';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyWyovBM731BKcyK9Zcuod9SxuKitRqYz3e35EuxzzefYUWm0yq3PrYEPb8HDLHLRzCE22dtrbJeOg&skey=9986ecffddb755ab&v=v27)
			format('woff2');
	}
	@font-face {
		font-family: 'Roboto Mono';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vqPRu-5IpykSbYAW8ZgTmsS241pEsZR3d6IJv4UDqRs2RBGnWi89ZG_JucDdQTxA1Ix6iS18Fk&skey=7b92570108d40690&v=v23)
			format('woff2');
	}
	@font-face {
		font-family: 'Roboto Slab';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjojISWbW5iddC21OSPVRp8v99MhJK0GgddeoliYahYfMub2RD8G_sZzLtgxdDT1td35hkvUCrl1Eg&skey=a9ad6a4717e923f0&v=v34)
			format('woff2');
	}
	@font-face {
		font-family: 'Rubik';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4i1VU80V4fdkLdjG-zmJC1Vv43UGRdiyn8bFUKghi05YPNRJ7W0NUsMwtDNpLMmhVQW8I_xSTI&skey=cee854e66788286d&v=v28)
			format('woff2');
	}
	@font-face {
		font-family: 'Titillium Web';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=NaPecZTIAOhVxoMyOr9n_E7fRMHsCoRTVJC58CB9gb7J9zbU7wIyPSrndaVS4KYutF90dP4oMUhzGn4rqs6USvohx_c5Uw&skey=19ee7c202c5bec48&v=v17)
			format('woff2');
	}
	@font-face {
		font-family: 'Ubuntu';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=4iCs6KVjbNBYlgo6fQTxv0y6O6Qmwc5NoRNB_UGsUPYodwynPAKU4oT0g_vGN1hTN-nEeyrXM5UsQuViPZ_B&skey=7e59fc036a1a8481&v=v20)
			format('woff2');
	}
	@font-face {
		font-family: 'Work Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/l/font?kit=QGY_z_wNahGAdqQ43RhVcIgYT2Xz5u32K0nXNi0Dp6_dMyD4bOAfZhKCrxTJYY9-KXsl8ptiAqrxm5VdA-sJCqW8n5JGiO42WyjvGZBPyqAS&skey=a19f1b3d756da88c&v=v19)
			format('woff2');
	}
</style>
