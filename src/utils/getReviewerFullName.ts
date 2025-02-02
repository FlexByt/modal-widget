import type { Reviewer } from "../types/review";

const getReviewerFullName = (
  showFullName: boolean,
  reviewer: Reviewer,
  verifiedReviewer: string
) => {
  if (!reviewer?.fullName) {
    return verifiedReviewer;
  }

  let name = "";

  try {
    name = decodeURIComponent(escape(reviewer.fullName));
  } catch (error) {
    name = reviewer.fullName;
  }

  if (showFullName) {
    return name;
  }

  return name.split(" ")[0];
};

export default getReviewerFullName;
