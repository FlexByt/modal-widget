import { onMount } from "svelte";
import { writable } from "svelte/store";
import getProductReviews from "../shared/utils/getProductReviews";
import { Loading } from "../shared/utils/types";
import { removeTrailingSlash } from "../shared/utils/utils";
import type { ReviewsJetPlatform } from "../types";
import type { ReviewType } from "../types/review";
import getOverralProductRating from "../utils/getOverralProductRating";
import getProductReviewSummary from "../utils/getProductReviewSummary";

export type PlatformEngine =
  | "yelp_reviews"
  | "google_maps_reviews"
  | "producthunt_reviews"
  | "trustpilot_reviews"
  | "tripadvisor_reviews"
  | "airbnb_reviews";

export type ThirdpartyAccount = {
  engine: any;
  pageId: string;
  propertyId: string;
  placeId: string;
};

export enum WidgetPosition {
  LEFT = "left",
  RIGHT = "right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}

export enum WidgetType {
  DEFAULT = "default",
  MINI = "mini",
  ADVANCED = "advanced",
}

export enum Plan {
  FREE = "free",
  PRO = "pro",
  ADVANCED = "advanced",
}

export type WidgetTranslation = {
  productReviewsTab: string;
  businessReviewsTab: string;
  widgetTitle: string;
  happyCustomersTitle: string;
};

export enum StarWidgetPosition {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export type ProductWidgetSettingsType = {
  setBackgroundColor: boolean;
  backgroundColor: string;
  textColor: string;
  buttonBorderColor: string;
  reviewsLimit: number;
};
export type StarWidgetType = {
  position: StarWidgetPosition;
};

export enum TestimonialWidget {
  SIMPLE = "simple",
}

export enum ShadowType {
  NONE = "none",
  NORMAL = "normal",
  FOCUS = "focus",
}
export enum ShadowSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}
export enum BackgroundType {
  TRANSPARENT = "transparent",
  SOLID_COLOR = "solid-color",
  GRADIENT = "gradient",
}

export type EmbeddedWidgetSettings = {
  // border settings
  showBorder: boolean;
  borderColor: string;
  borderWidth: number;
  borderRadius: string;

  // shadow settings
  shadowType: ShadowType;
  shadowSize: ShadowSize;
  shadowColor: string;

  // background settings
  backgroundColorType: BackgroundType;
  backgroundColor: string;
  backgroundColorGradient: string;
  reviewCardColor: string;
  reviewCardBackgroundType: BackgroundType;

  // text settings
  textColor: string;
  dateColor: string;
  linkColor: string;
  starColor: string;
  buttonTextColor: string;
  buttonBackgroundColor: string;

  // other settings
  hideSourceIcon: boolean;
  showOverallRating: boolean;
  acceptReviews: boolean;
  mixWithProductReviews: boolean;
  showReviewDate: boolean;
};
export enum ProductWidgetType {
  DEFAULT = "default",
  GRID = "grid",
}

export enum ModalReviewWidgetType {
  DEFAULT = "default",
  MINI = "mini",
  ADVANCED = "advanced",
}

export type ModalReviewsOtherSettings = {
  showBusinessReviews: boolean;
  showProductReviews: boolean;
  isSticky: boolean;
  showReviewDate: boolean;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  borderColor: string;
  borderWidth: number;
  reviewCardColor: string;
  linkColor: string;
  hideSourceIcon: boolean;
  starColor: string;
  dateColor: string;
  textColor: string;
  hideHelpfulCount: boolean;
  acceptReviews: boolean;
};

export type ProductWidgetSettings = Omit<
  EmbeddedWidgetSettings,
  | "borderRadius"
  | "mixWithProductReviews"
  | "acceptReviews"
  | "showOverallRating"
  | "hideSourceIcon"
> & {
  reviewsLimit: number;
  variant: ProductWidgetType;
  hideHelpfulCount: boolean;
};

export type ModalReviewsSettings = {
  desktopSettings: {
    visible: boolean;
    variant: ModalReviewWidgetType;
    position: WidgetPosition;
  };
  mobileSettings: {
    visible: boolean;
    variant: ModalReviewWidgetType;
    position: WidgetPosition;
  };
  showBusinessReviews: boolean;
  showProductReviews: boolean;
  isSticky: boolean;
  showReviewDate: boolean;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  borderColor: string;
  borderWidth: number;
  reviewCardColor: string;
  linkColor: string;
  hideSourceIcon: boolean;
  starColor: string;
  dateColor: string;
  textColor: string;
  hideHelpfulCount: boolean;
  acceptReviews: boolean;
};

export type ReviewQuestionSettings = {
  status: boolean;
  title: string;
  message: string;
  questions: string[];
  collectionType: string;
};

export type ThankYouSettings = {
  showImage: boolean;
  imageBorderRadius: number;
  image: string;
  title: string;
  message: string;
  allowSocialShare: boolean;
  rewardVideoReview: {
    status: boolean;
    subject: string;
    message: string;
  };
}

export type WidgetSettings = {
  _id: string;
  siteId: string;
  instanceId: string;
  modalWidget: ModalReviewsSettings;
  productWidget: ProductWidgetSettings;
  starWidget: {
    position: WidgetPosition;
    starColor: string;
  };
  brandingSettings: BrandingSettings;
  reviewQuestions: ReviewQuestionSettings;
  thankYouPage:ThankYouSettings
};

export type ProductReviewRatingSummary = {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStars: number;
};

export type BrandingSettings = {
  rtl: boolean;
  thankYouImage: string;
  showFullName: boolean;
  fontFamily: string;
  dateFormat: string;
  autoPublishEnabled: boolean;
  autoPublishRating: number;
  useMyWebsiteFontFamily: boolean;
  submissionType: "reviewsjet" | "thirdparty";
  submitReviewsTo: string[];
  displayLocation: boolean
};

type SettingsStore = {
  widgetSettings: WidgetSettings | null;
  loading: Loading;
  error: string | null;
  instanceId: string;
  siteId: string;
  plan: Plan | null;
  thirdpartyAccounts: ThirdpartyAccount[];
  rating: number;
  _totalDocs: number;
  platform: ReviewsJetPlatform | null;
  _overrallRating: any;
  _loadingReviewsState: Loading;
  _reviews: ReviewType[];
  _page: number;
  _hasNextPage: boolean;
  productRatingSummary: ProductReviewRatingSummary | null;
  publicIpAddress: string | null;
  siteName :string | null
};

export default function ({
  instanceId,
  productId,
  siteId,
}: {
  instanceId: string;
  productId?: string;
  siteId?: string;
}) {
  let settingsStore = writable<SettingsStore>({
    thirdpartyAccounts: [],
    plan: null,
    widgetSettings: null,
    loading: Loading.PENDING,
    error: null,
    instanceId,
    siteId,
    rating: 1,
    platform: null,
    _totalDocs: 0,
    _overrallRating: 1,
    _loadingReviewsState: Loading.INITIAL,
    _reviews: [],
    _page: 0,
    _hasNextPage: false,
    productRatingSummary: null,
    publicIpAddress: null,
    siteName: null,
  });

  const getSettings = async () => {
    try {
      if (instanceId || siteId) {
        const { plan, settings, platform, thirdpartyAccounts, siteName } = (await (
          await fetch(
            `${removeTrailingSlash(
              process.env.REVIEWS_JET_API
            )}/widget/widget-settings?instanceId=${instanceId}&siteId=${siteId}`
          )
        ).json()) as {
          settings: WidgetSettings;
          plan: Plan;
          siteName: string;
          platform: ReviewsJetPlatform;
          thirdpartyAccounts: ThirdpartyAccount[];
        };

        // const {ip: publicIpAddress} = await (await fetch('https://api.ipify.org/?format=json')).json()

        const publicIpAddress = null;

        if (productId) {
          const [reviewsResponse, { rating }, { productRatingSummary }] =
            await Promise.all([
              getProductReviews({ instanceId, productId, siteId }),
              getOverralProductRating({ instanceId, productId, siteId }),
              getProductReviewSummary({ instanceId, productId, siteId }),
            ]);

          const _totalDocs = reviewsResponse.totalDocs;
          const _overrallRating = (Math.round(rating * 10) / 10).toFixed(1);
          const _loadingReviewsState = Loading.SUCCESS;
          const _reviews = reviewsResponse.docs;
          const _page = reviewsResponse.page;
          const _hasNextPage = reviewsResponse.hasNextPage;

          settingsStore.update((current) => ({
            ...current.widgetSettings,
            widgetSettings: settings,
            loading: Loading.SUCCESS,
            error: null,
            plan,
            thirdpartyAccounts,
            platform,
            rating,
            _totalDocs,
            _overrallRating,
            _loadingReviewsState,
            _reviews,
            _page,
            _hasNextPage,
            productRatingSummary,
            publicIpAddress,
            siteName
          }));
        } else {
          settingsStore.update((current) => ({
            ...current.widgetSettings,
            widgetSettings: settings,
            loading: Loading.SUCCESS,
            error: null,
            plan,
            thirdpartyAccounts,
            platform,
            rating: 0,
            _totalDocs: 0,
            _overrallRating: 0,
            _loadingReviewsState: Loading.INITIAL,
            _reviews: [],
            _page: 0,
            _hasNextPage: false,
            productRatingSummary: null,
            publicIpAddress,
            siteName
          }));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  onMount(() => {
    getSettings();
  });

  return settingsStore;
}
