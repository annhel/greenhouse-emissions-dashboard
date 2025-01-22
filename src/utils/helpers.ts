// Returns an array of numbers between two values
export const range = (
  start: number,
  end: number,
  step: number = 1
): number[] => {
  return Array.from(
    { length: Math.floor((end - start) / step) + 1 },
    (_, i) => start + i * step
  );
};
