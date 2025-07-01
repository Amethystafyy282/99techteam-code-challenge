import { useMemo } from "react";

interface UsePrices {
  getPriceByCurrency: (currency: string) => number;
}

export const usePrices = (): UsePrices => {
  const getPriceByCurrency = (currency: string) => {
    switch (currency) {
      case "Pound":
        return 100;
      case "Dollar":
        return 50;
      default:
        return 0;
    }
  };

  return { getPriceByCurrency };
};
