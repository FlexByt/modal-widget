import { removeTrailingSlash } from "../shared/utils/utils";
import type { GetReviewResponse } from "../types/review";

const getSiteReviews = async ({
  nextPage = 1,
  instanceId,
  count = 3,
  random = false,
  siteId,
}: {
  instanceId: string;
  count?: number;
  nextPage?: number;
  random?: boolean;
  siteId: string;
}) => {
  if (!Number(count)) {
    return Promise.resolve({
      docs: [],
      page: nextPage,
      hasNextPage: false,
      totalDocs: 0,
    });
  }

  let url = `${removeTrailingSlash(
    process.env.REVIEWS_JET_API
  )}/widget/site-reviews/list?limit=${count}&random=${random}&siteId=${siteId}`;

  url += `&page=${nextPage}`;

  const response: GetReviewResponse = await (await fetch(url)).json();

  return response.reviews;
};

export default getSiteReviews;
