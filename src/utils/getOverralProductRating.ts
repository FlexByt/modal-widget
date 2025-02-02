import { removeTrailingSlash } from "../shared/utils/utils";

const getOverralProductRating = async ({
  instanceId,
  productId,
  siteId,
}: {
  instanceId: string;
  productId?: string;
  siteId: string;
}) => {
  let url = `${removeTrailingSlash(
    process.env.REVIEWS_JET_API
  )}/widget/product-reviews/rating?instanceId=${instanceId}&siteId=${siteId}`;

  if (productId) {
    url += `&productId=${productId}`;
  }

  try {
    const { rating } = await (await fetch(url)).json();

    return { rating };
  } catch (error) {}
};

export default getOverralProductRating;
