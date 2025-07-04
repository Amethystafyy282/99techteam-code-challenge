export const useSummaryMethods = () => {
  const sum_to_n_a = (n: number): number => {
    if (n <= 0) {
      return 0;
    }

    let sum: number = 0;

    for (let i = 1; i <= n; i++) {
      sum += i;
    }

    return sum;
  };

  const sum_to_n_b = (n: number): number => {
    if (n <= 0) {
      return 0;
    }

    return new Array(n).fill(true).reduce((acc, _, i) => acc + i + 1, 0);
  };

  const sum_to_n_c = (n: number): number => {
    if (n > 0) {
      let sum: number = 0;

      new Array(n).fill(true).forEach((_, i) => {
        sum += i + 1;
      });

      return sum;
    }

    return 0;
  };

  return {
    sum_to_n_a,
    sum_to_n_b,
    sum_to_n_c,
  };
};
