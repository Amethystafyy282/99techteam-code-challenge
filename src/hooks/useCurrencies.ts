import { useEffect, useState } from "react";

export interface Currency {
  currency: string;
  price: number;
  date: string;
}

interface UseWalletBalances {
  currencies: Array<Currency> | undefined;
}

export const useCurrencies = (): UseWalletBalances => {
  const [currencies, setCurrencies] = useState<Array<Currency> | undefined>(
    undefined,
  );

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((results: Array<Currency>) => {
        if (Array.isArray(results)) {
          // to prevent currency's duplication
          const uniques = new Map<string, Currency>();

          results.forEach((c) => {
            if (!uniques.has(c.currency)) {
              uniques.set(c.currency, c);
            }
          });

          const toArray = Array.from(uniques.values());
          setCurrencies(toArray);
        } else {
          setCurrencies([]);
        }
      })
      .catch(() => {
        setCurrencies([]);
      });
  }, []);

  return { currencies };
};
