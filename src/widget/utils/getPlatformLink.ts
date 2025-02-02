import { ReviewPlatform } from "../../types/review";
import type { ConnectedAccounts } from "./getConnectedAccounts";

const getPlatformLink = (
  source: ReviewPlatform,
  connectedAcounts: ConnectedAccounts
) => {
  switch (source) {
    case ReviewPlatform.ALI_EXPRESS:
    case ReviewPlatform.AMAZON:
    case ReviewPlatform.ETSY:
    case ReviewPlatform.GOOGLE: {
      if (connectedAcounts?.google) {
        const { placeId } = connectedAcounts.google;
        return `https://search.google.com/local/reviews?placeid=${placeId}`;
      }
    }
    case ReviewPlatform.WIDGET_REVIEW:
    case ReviewPlatform.YELP: {
      if (connectedAcounts?.yelp) {
        const { domain, placeId } = connectedAcounts.yelp;
        return `https://${domain}/biz/${placeId}#reviews`;
      }
    }
    case ReviewPlatform.FACEBOOK:
      if (connectedAcounts?.facebook?.id) {
        return `https://www.facebook.com/${connectedAcounts?.facebook?.id}/reviews/`;
      }
    default:
      return "";
  }
};

export default getPlatformLink;
