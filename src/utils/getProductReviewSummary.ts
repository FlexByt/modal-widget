import { removeTrailingSlash } from "../shared/utils/utils";

const getProductReviewSummary = async ({
  instanceId,
  productId,
  siteId,
}: {
  siteId: string;
  instanceId: string;
  productId?: string;
}) => {
  let url = `${removeTrailingSlash(
    process.env.REVIEWS_JET_API
  )}/widget/ratings-summary?productId=${productId}&siteId=${siteId}`;

  try {
    const { summary } = await (await fetch(url)).json();

    return { productRatingSummary: summary };
  } catch (error) {}
};

export default getProductReviewSummary;
