const range = (start: number, stop: number) => {
  try {
    return Array.from({ length: stop - start + 1 }, (_, i) => start + i);
  } catch (error) {}
};

export default range;
