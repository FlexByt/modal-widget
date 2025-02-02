import type { Reviewer } from "../../types/review";

const getReviewerFullName = (
  showFullName: boolean,
  reviewer: Reviewer,
  verifiedReviewer: string
) => {
  if (!reviewer?.fullName) {
    return verifiedReviewer;
  }

  if (showFullName) {
    return reviewer.fullName;
  }

  const [firstName, lastName] = reviewer.fullName.split(" ")

  if (lastName) {

    return `${firstName} ${lastName.slice(0,1).toUpperCase()}`
  } else {
    return firstName;
  }
};

export default getReviewerFullName;
