import type { GetReviewResponse } from "../../types/review";
import { removeTrailingSlash } from "./utils";

const getProductReviews = async ({
  nextPage = 1,
  productId,
  rating,
  sortBy,
  siteId,
}: {
  instanceId: string;
  productId: string;
  nextPage?: number;
  rating?: number | null;
  sortBy?: string;
  siteId: string;
}) => {
  let url = `${removeTrailingSlash(
    process.env.REVIEWS_JET_API
  )}/widget/product-reviews/list?productId=${productId}&siteId=${siteId}`;

  url += `&page=${nextPage}`;

  if (rating) {
    url += `&rating=${rating}`;
  }

  if (sortBy) {
    url += `&sortBy=${sortBy}`;
  }

  const response: GetReviewResponse = await (await fetch(url)).json();

  return response.reviews;
};

export default getProductReviews;
