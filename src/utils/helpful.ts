import { removeTrailingSlash } from "../shared/utils/utils";

const helpful = async (id: string, siteId: string, instanceId: string) => {
  const url = `${removeTrailingSlash(
    process.env.REVIEWS_JET_API
  )}/widget/reviews/helpful`;

  await (
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instanceId, siteId, id }),
    })
  ).json();
};

export default helpful;
