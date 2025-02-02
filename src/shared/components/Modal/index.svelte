<script lang="ts">
  import dayjs from "dayjs";
  import initials from "initials";
  import Scrollbar from "smooth-scrollbar";
  import { fade } from "svelte/transition";
  import { Plan, WidgetSettings } from "../../../stores/settingsStore";
  import { ReadOnlyRatingSize } from "../../../types";
  import { ReviewPlatform, ReviewType } from "../../../types/review";
  import { HELPFUL } from "../../../utils/constants";
  import generateColorHsl from "../../../utils/generateColorHsl";
  import getReviewerFullName from "../../../utils/getReviewerFullName";
  import Close from "../Close.svelte";
  import GoogleIcon from "../GoogleIcon.svelte";
  import ReadOnlyRating from "../ReadOnlyRating.svelte";
  import Verified from "../Verified.svelte";
  import YelpIcon from "../YelpIcon.svelte";

  export let accountPlan: Plan;
  export let helpfulReviewId: string;
  export let selectedReview: ReviewType;
  export let settings: WidgetSettings;
  export let toggleModal: (review: ReviewType) => void;

  let reviewJetAvatar: HTMLDivElement;
  let reviewsJetModal: HTMLDivElement;
  let reviewerNameElement: HTMLDivElement;
  let reviewsJetEmbeddedModalContent: HTMLDivElement;

  let helpfulTotal = 0;
  let isHelpful = false;
  const {
    id,
    verified,
    rating,
    reviewDate,
    reviewer,
    helpfulCount,
    platform,
    content: reviewMessage,
    product,
  } = selectedReview;
  const productSlug = product?.slug;
  const {
    translation: {
      verifiedReviewer,
      reviewForm: { addReview },
    },
    brandingSettings: {
      fontFamily,
      rtl,
      useMyWebsiteFontFamily,
      showFullName,
      dateFormat,
    },
    modalWidget: { linkColor, showReviewDate, starColor = "#000" },
  } = settings;

  helpfulTotal = helpfulCount;
  const avatar = reviewer?.avatar;
  const fullName = reviewer?.fullName ?? verifiedReviewer;
  const reviewerName = getReviewerFullName(
    showFullName,
    reviewer,
    verifiedReviewer
  );
  const helpfulReviews: string[] =
    JSON.parse(localStorage.getItem(HELPFUL)) ?? [];

  $: if (reviewsJetModal && fontFamily && !useMyWebsiteFontFamily) {
    reviewsJetModal.style.fontFamily = `${fontFamily}, sans-serif`;
  }

  $: if (reviewerNameElement) {
    reviewerNameElement.style.color = linkColor;
  }

  $: if (reviewsJetEmbeddedModalContent) {
    if (!useMyWebsiteFontFamily) {
      reviewsJetEmbeddedModalContent.style.fontFamily = `${fontFamily}, sans-serif`;
    }
    Scrollbar.init(reviewsJetEmbeddedModalContent);
  }

  $: if (
    helpfulReviewId === selectedReview.id ||
    helpfulReviews.includes(selectedReview.id)
  ) {
    isHelpful = true;
  }

  $: if (reviewJetAvatar) {
    if (!avatar) {
      reviewJetAvatar.textContent = initials(fullName.toUpperCase()).substring(
        0,
        2
      );
      reviewJetAvatar.style.backgroundColor = generateColorHsl(fullName);
      reviewJetAvatar.style.opacity = "0.6";
    } else {
      const image = document.createElement("img");
      image.style.height = "45px";
      image.style.width = "45px";
      image.style.borderRadius = "100%";
      image.style.border = "1px solid RGB(221, 221, 221)";
      image.style.padding = "1px";
      image.src = avatar;
      if (platform === ReviewPlatform.GOOGLE) {
        const referrerpolicy = document.createAttribute("referrerpolicy");
        referrerpolicy.value = "no-referrer";
        image.setAttributeNode(referrerpolicy);
      }

      reviewJetAvatar.appendChild(image);
    }
  }
</script>

<div class="reviews-jet-widget-modal" bind:this={reviewsJetModal}>
  <div
    class="reviews-jet-mask"
    on:click={() => toggleModal(selectedReview)}
    on:keydown={() => {}}
  />
  <div
    class="reviews-jet-dialog"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <div
      class="close-icon-wrapper"
      on:click={() => toggleModal(selectedReview)}
      on:keydown={() => {}}
    >
      <Close />
    </div>
    <div class="reviewsJet-embedded-modal-content">
      {#if showReviewDate}
        <span
          style="font-size: 12px; color: rgb(99, 99, 99); display: block; text-align: right; padding-right: 30px;"
          >{dayjs(reviewDate).format(dateFormat)}</span
        >
      {/if}
      <div class="reviewsJet-top-div">
        <div class="reviewsJetTopLeft">
          <div class="reviews-jet-avatar" bind:this={reviewJetAvatar}>
            {#if verified}
              <div class="reviews-jet-verified-badge" title={verifiedReviewer}>
                <Verified />
              </div>
            {/if}
          </div>
        </div>
        <div class="reviews-jet-reviewer-date">
          <div class="reviews-jet-reviewer">
            <div class="reviews-jet-name-wrapper">
              <div
                class="reviews-jet-reviewer-name"
                bind:this={reviewerNameElement}
              >
                {reviewerName}
              </div>
              {#if platform === ReviewPlatform.GOOGLE}
                <GoogleIcon />
              {/if}
              {#if platform === ReviewPlatform.YELP}
                <YelpIcon />
              {/if}
            </div>
          </div>
          <div class="reviews-jet-review-rating">
            <ReadOnlyRating
              {rating}
              {starColor}
              size={ReadOnlyRatingSize.SMALL}
            />
          </div>
        </div>
      </div>
      <div
        class="reviewsJet-embedded-review-wrapper"
        data-scrollbar="true"
        bind:this={reviewsJetEmbeddedModalContent}
      >
        <span class="reviews-jet-content">{reviewMessage}</span>
      </div>
    </div>
    {#if accountPlan === Plan.FREE}
      <a
        href="https://www.reviewsjet.com"
        rel="noreferrer"
        target="_blank"
        style="margin-top: 5px; text-align: center; font-size: 12px; position: absolute; bottom: -25px; color: rgb(255, 255, 255); width: 100%; text-decoration: none; font-family: {fontFamily
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
    z-index: 2147483647;
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
      -moz-opacity: 0.7;
      opacity: 0.7;
      filter: opacity(70);
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
      width: 530px;
      min-height: 149px;
      background: #ffffff;
      border-radius: 15px;
      z-index: 1000;
      margin: 0 auto;
      -webkit-transition: top 0.7s ease-in-out 0.1s;
      -moz-transition: top 0.7s ease-in-out 0.1s;
      -ms-transition: top 0.7s ease-in-out 0.1s;
      -o-transition: top 0.7s ease-in-out 0.1s;
      transition: top 0.7s ease-in-out 0.1s;
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
    .reviewsJet-embedded-modal-content {
      margin-top: 30px;
      /* width: calc(100% - 62px); */
      position: relative;
      padding: 0 0 30px 30px;
      text-align: left;
      .reviews-jet-reviewer-date {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        .reviews-jet-reviewer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .reviews-jet-reviewer-name {
          font-size: 15px;
        }
      }
    }
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
      }
    }
    .reviews-jet-avatar {
      color: #fff;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      text-align: center;
      font-family: Arial;
      font-size: 13px;
      font-weight: bold;
      position: relative;

      .reviews-jet-verified-badge {
        margin-left: 3px;
        height: 15px;
        display: inline-block;
        position: absolute;
        right: -5px;
        bottom: 0;
        border: 1px solid #fff;
        border-radius: 100%;
        background: #fff;
      }

      @media (max-width: 300px) {
        width: 30px;
        height: 30px;
        font-size: 12px;
      }
    }
    .reviewsJet-top-div {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .reviewsJet-embedded-review-wrapper {
      height: 150px;
      overflow: hidden;
      font-size: 15px;
      line-height: 25px;
      margin-top: 20px;
      padding-right: 30px;
      @media (max-width: 644px) {
        display: block;
        position: relative;
        height: calc(100vh - 120px) !important;
      }
    }
    .reviews-jet-name-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
</style>
