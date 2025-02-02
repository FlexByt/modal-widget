import { ReviewPlatform } from "../../types/review";

const getPlatformName = (source: ReviewPlatform) => {
  switch (source) {
    case ReviewPlatform.ALI_EXPRESS:
      return "AliExpress";
    case ReviewPlatform.AMAZON:
      return "Amazon";
    case ReviewPlatform.ETSY:
      return "Etsy";
    case ReviewPlatform.GOOGLE:
      return "Google";
    case ReviewPlatform.YELP:
      return "Yelp";
    case ReviewPlatform.FACEBOOK:
      return "Facebook";
    default:
      return "";
  }
};

export default getPlatformName;
