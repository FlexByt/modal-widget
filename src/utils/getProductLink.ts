import { ReviewsJetPlatform } from "../types";

export default function getProductLink(
  platform: ReviewsJetPlatform | null,
  slug: string
) {
  const { hostname, protocol } = window.location;

  switch (platform) {
    case ReviewsJetPlatform.WIX:
      return `${protocol}//${hostname}/product-page/${slug}`;

    case ReviewsJetPlatform.SHOPIFY:
      return `${protocol}//${hostname}/products/${slug}`;

    default:
      break;
  }
}
