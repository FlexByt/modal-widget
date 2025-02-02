import type { ThirdpartyAccount } from "../stores/settingsStore";


export type ReviewFormPlatform =
  | "yelp_reviews"
  | "google_maps_reviews"
  | "producthunt_reviews"
  | "trustpilot_reviews"
  | "tripadvisor_reviews";

const getThirdPartyReviewSubmissionFormURL = (
  platform: ReviewFormPlatform,
  thirdpartyAccount: ThirdpartyAccount
) => {
  switch (platform) {
    case "google_maps_reviews": {
      return `https://search.google.com/local/writereview?placeid=${thirdpartyAccount.placeId}`;
    }

    case "yelp_reviews":
      return `https://www.yelp.com/writeareview/biz/${thirdpartyAccount.placeId}`

    case "trustpilot_reviews":
      return `https://www.trustpilot.com/review/${thirdpartyAccount.pageId}`;

    case "producthunt_reviews":
      return `https://www.producthunt.com/products/${thirdpartyAccount.pageId}/reviews/new`;

    case "tripadvisor_reviews": {
      const [_, first, second] = thirdpartyAccount.pageId.split("-");

      return `https://www.tripadvisor.com/UserReviewEdit-${first}-${second}`;
    }

    default:
      break;
  }
};

export default getThirdPartyReviewSubmissionFormURL;
