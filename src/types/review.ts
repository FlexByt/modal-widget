export type Reviewer = {
  _id: string;
  instanceId: string;
  email?: string;
  fullName?: string;
  avatar?: string;
};

export type Product = {
  _id: string;
  slug: string;
};

export enum ReviewPlatform {
  ETSY = "etsy",
  AMAZON = "amazon",
  ALI_EXPRESS = "aliexpress",
  YELP = "yelp",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  WIDGET_REVIEW = "widgetReview",
  APPLE = "apple",
  PRODUCTHUNT = "producthunt",
  TRUSTPILOT = "trustpilot",
  CAPTERRA = "capterra",
  TRIPADVISOR = "tripadvisor",
  AIRBNB = "airbnb",
  FRESHA = 'fresha',
  TOUR_RADAR = 'tourradar',
}

export type ReviewType = {
  _id: string;
  id: string;
  content: string;
  pictures: string;
  link: string;
  verified: boolean;
  title?: string;
  reviewDate: string;
  created_at: string;
  updated_at: string
};

export type ReviewsResponse = {
  docs: ReviewType[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
};

export type GetReviewResponse = {
  reviews: ReviewsResponse;
};
