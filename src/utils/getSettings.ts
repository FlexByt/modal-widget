import { removeTrailingSlash } from "../shared/utils/utils";

const getSettings = async (instanceId: string) => {
  try {
    const url = `${removeTrailingSlash(
      process.env.REVIEWS_JET_API
    )}/widget-settings?instanceId=${instanceId}`;
    const settings = await (await fetch(url)).json();

    return settings;
  } catch {}
};

export default getSettings;
