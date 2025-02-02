type Params = {
  total: number;
  ratingGroupTotal: number;
};

const getRatingPercentage = ({ total, ratingGroupTotal }: Params) => {
  return (ratingGroupTotal * 100) / total;
};

export default getRatingPercentage;
