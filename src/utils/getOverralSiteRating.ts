import { removeTrailingSlash } from "../shared/utils/utils";

const getOverrallRating = async ({
  instanceId,
  siteId,
}: {
  instanceId: string;
  siteId: string;
}) => {
  try {
    const { averageRating, reviewsCount: {totalPublishedReviews, publishedBusinessReviews, publishedProductReviews},  } = await (
      await fetch(
        `${removeTrailingSlash(
          process.env.REVIEWS_JET_API
        )}/widget/ratings-summary?instanceId=siteId=${siteId}&widget=modal-widget`
      )
    ).json();

    return { averageRating, totalPublishedReviews, publishedBusinessReviews, publishedProductReviews };
  } catch (error) {}
};

export default getOverrallRating;
