import { removeTrailingSlash } from "../../shared/utils/utils";

export type ConnectedAccount = {
  id: string;
  name: string;
};

export type ConnectedAccounts = {
  facebook?: ConnectedAccount;
  yelp?: { domain: string; placeId: string };
  google?: { placeId: string };
};

const getConnectedAccounts = async (instanceId: string) => {
  let connectedAccounts: ConnectedAccounts | null = null;

  try {
    const {
      facebookPage,
      yelp: yelpAccount,
      google: googleAccount,
    } = await (
      await fetch(
        `${removeTrailingSlash(
          process.env.REVIEWS_JET_API
        )}/widget/third-party/connected?instanceId=${instanceId}`
      )
    ).json();

    if (facebookPage) {
      const { pageId, name: facebookPageName } = facebookPage;

      connectedAccounts = {
        facebook: {
          id: pageId,
          name: facebookPageName,
        },
      };
    }

    if (yelpAccount) {
      const { domain, placeId } = yelpAccount;
      connectedAccounts = { ...connectedAccounts, yelp: { domain, placeId } };
    }

    if (googleAccount) {
      const { placeId } = googleAccount;
      connectedAccounts = { ...connectedAccounts, google: { placeId } };
    }

    return connectedAccounts;
  } catch (error) {}
};

export default getConnectedAccounts;
