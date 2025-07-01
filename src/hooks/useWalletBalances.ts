import { useCallback, useEffect, useState } from "react";

export interface WalletBalance {
  currency: string;
  amount: number;
}

interface UseWalletBalances {
  fetchWalletBalance: () => Promise<Array<WalletBalance>>;
}

export const useWalletBalances = (): UseWalletBalances => {
  const fetchWalletBalance = useCallback((): Promise<Array<WalletBalance>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { currency: "Pound", amount: 100 },
          { currency: "Dollar", amount: 50 },
        ]);
      }, 3000);
    });
  }, []);

  return { fetchWalletBalance };
};
