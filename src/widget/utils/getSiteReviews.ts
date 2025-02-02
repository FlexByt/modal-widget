import { removeTrailingSlash } from "../../shared/utils/utils";
import type { GetReviewResponse } from "../../types/review";

const getReviews = async ({
  nextPage = 1,
  instanceId,
  reviewType,
  siteId,
}: {
  siteId: string;
  instanceId: string;
  nextPage?: number;
  reviewType?: "business" | "product";
}) => {
  let url = `${removeTrailingSlash(
    process.env.REVIEWS_JET_API
  )}/widget/site-reviews/list?instanceId=${instanceId}&limit=10&siteId=${siteId}`;

  if (reviewType) {
    url += `&reviewType=${reviewType}`;
  }

  url += `&page=${nextPage}&widget=modal-widget`;

  const response: GetReviewResponse = await (await fetch(url)).json();

  return response.reviews;
};

export default getReviews;
