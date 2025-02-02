<script lang="ts">
  import { fade } from "svelte/transition";
  import Close from "../../../shared/components/Close.svelte";
  import { ActiveView, Loading } from "../../../shared/utils/types";
  import {
    Plan,
    ThirdpartyAccount,
    WidgetSettings,
  } from "../../../stores/settingsStore";
  import { ReviewsJetPlatform } from "../../../types";
  import type { ReviewType } from "../../../types/review";
  import Form from "./form/index.svelte";
  import ReviewQuestions from "./review-questions/index.svelte";
  import Reviews from "./reviews/index.svelte";
  import ThankYou from "./thankYou/index.svelte";

  export let siteId: string;
  export let page: number;
  export let openForm: boolean;
  export let totalDocs: number;
  export let accountPlan: Plan;
  export let instanceId: string;
  export let campaignId: string;
  export let hasNextPage: boolean;
  export let businessReviews: ReviewType[];
  export let toggleModal: () => void;
  export let overrallRating: number;
  export let loadingReviews: Loading;
  export let settings: WidgetSettings;
  export let accountPlatform: ReviewsJetPlatform;
  export let toggleReviewPictureModal: (props: {
    pic: string;
    videoUrl?: string;
  }) => void;
  export let fetchMoreReviews: (page: number) => void;
  export let fetchMoreProductReviews: (page: number) => void;
  export let productReviews: ReviewType[];
  export let productReviewsPage: number;
  export let thirdpartyAccounts: ThirdpartyAccount[];
  export let productReviewsHasNextPage: boolean;
  export let productReviewsTotalDocs: number;
  export let totalPublishedReviews: number;
  export let publishedBusinessReviews: number;
  export let publishedProductReviews: number;
  export let publicIpAddress: string | null;
  export let isMobile: boolean;
  export let siteName: string;

  let reviewsjetDialog: HTMLDivElement;
  let activeView = openForm ? ActiveView.FORM : ActiveView.REVIEWS;
  // let activeView = openForm ? ActiveView.FORM : ActiveView.THANK_YOU;
  let reviewsJetModal: HTMLDivElement;
  const {
    reviewQuestions,
    brandingSettings: { fontFamily, useMyWebsiteFontFamily },
  } = settings;

  const { status: enabledQuestions } = reviewQuestions;

  const setActiveView = (view: ActiveView) => {
    activeView = view;
  };

  $: if (reviewsJetModal && fontFamily && !useMyWebsiteFontFamily) {
    reviewsJetModal.style.fontFamily = `${fontFamily}, sans-serif`;
  }

  $: if (!!enabledQuestions) {
    // activeView = ActiveView.QUESTIONS;
  }
</script>

<div class="reviews-jet-widget-modal" bind:this={reviewsJetModal}>
  <div class="reviews-jet-mask" on:click={toggleModal} on:keydown={() => {}} />
  <div
    class="reviews-jet-dialog"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 200 }}
    bind:this={reviewsjetDialog}
    style={`${
      [ActiveView.QUESTIONS, ActiveView.VIDEO, ActiveView.THANK_YOU].includes(
        activeView
      )
        ? "height: auto"
        : ""
    }; ${activeView === ActiveView.FORM && !isMobile ? "height: unset" : ""}`}
  >
    <div
      class="close-icon-wrapper"
      on:click={toggleModal}
      on:keydown={() => {}}
    >
      <Close />
    </div>
    {#if activeView === ActiveView.REVIEWS}
      <Reviews
        {siteId}
        {settings}
        {instanceId}
        {page}
        {hasNextPage}
        {totalDocs}
        {fetchMoreReviews}
        {overrallRating}
        setActiveView={(value) => {
          if (!!enabledQuestions) {
            setActiveView(ActiveView.QUESTIONS);
          } else {
            setActiveView(value);
          }
        }}
        loadingState={loadingReviews}
        {businessReviews}
        {productReviews}
        {productReviewsPage}
        {productReviewsHasNextPage}
        {fetchMoreProductReviews}
        {toggleReviewPictureModal}
        {productReviewsTotalDocs}
        {accountPlatform}
        {thirdpartyAccounts}
        {publishedBusinessReviews}
        {publishedProductReviews}
        {totalPublishedReviews}
        {siteName}
      />
    {:else if activeView === ActiveView.QUESTIONS}
      <ReviewQuestions
        {reviewQuestions}
        {settings}
        handleSendInText={() => setActiveView(ActiveView.FORM)}
        handleSendVideo={() => setActiveView(ActiveView.VIDEO)}
        onBack={() => setActiveView(ActiveView.REVIEWS)}
      />
    {:else if activeView === ActiveView.FORM}
      <Form
        {instanceId}
        {reviewQuestions}
        {settings}
        {setActiveView}
        {campaignId}
        {siteId}
        {publicIpAddress}
        onBack={() => {
          if (reviewQuestions.status) {
            setActiveView(ActiveView.QUESTIONS);
          } else {
            setActiveView(ActiveView.REVIEWS);
          }
        }}
      />
    {:else}
      <ThankYou {settings} {setActiveView} {useMyWebsiteFontFamily} />
    {/if}
    {#if accountPlan === Plan.FREE && accountPlatform !== ReviewsJetPlatform.SHOPIFY}
      <a
        href="https://www.reviewsjet.com"
        rel="noreferrer"
        target="_blank"
        style="margin-top: 5px; text-align: center; font-size: 12px; position: absolute; bottom: -25px; color: rgb(255, 255, 255); width: 100%; text-decoration: none; font-family: {useMyWebsiteFontFamily
          ? `${fontFamily}, sans-serif`
          : ''}"
      >
        Powered by ReviewsJet
      </a>
    {/if}
  </div>
</div>

<style type="text/scss">
  .reviews-jet-widget-modal {
    color: #000;
    z-index: 2147483646;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .reviews-jet-mask {
      display: block;
      z-index: 900;
      background: #000;
      width: 100%;
      height: 100%;
      -moz-opacity: 0.8;
      opacity: 0.8;
      filter: opacity(80);
      -webkit-transition: opacity 0.5s ease-out 0s;
      -moz-transition: opacity 0.5s ease-out 0s;
      -ms-transition: opacity 0.5s ease-out 0s;
      -o-transition: opacity 0.5s ease-out 0s;
      transition: opacity 0.5s ease-out 0s;
      position: fixed;
      left: 0;
      top: 0;
      cursor: pointer;
    }
    .reviews-jet-dialog {
      position: relative;
      height: 580px;
      width: 500px;
      min-height: 149px;
      background: #ffffff;
      border-radius: 10px;
      z-index: 1000;
      margin: 0 auto;
      -webkit-transition: top 0.7s ease-in-out 0.1s;
      -moz-transition: top 0.7s ease-in-out 0.1s;
      -ms-transition: top 0.7s ease-in-out 0.1s;
      -o-transition: top 0.7s ease-in-out 0.1s;
      transition: top 0.7s ease-in-out 0.1s;

      .close-icon-wrapper {
        cursor: pointer;
        height: 34px;
        width: 34px;
        border-radius: 50%;
        position: absolute;
        right: -45px;
        top: 0px;
        opacity: 1;
        color: #fff;
        /* transition-delay: 300ms; */

        &:hover {
          background: #606060;
        }
        @media (max-width: 644px) {
          right: 0;
          color: #000;
          z-index: 9998;
        }
      }
    }
    @media (max-width: 644px) {
      .reviews-jet-dialog {
        top: 0;
        border-radius: 0;
        height: 100% !important;
        width: 100%;
        max-width: 644px;
      }
    }
  }
</style>
