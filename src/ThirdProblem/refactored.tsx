import { useMemo } from "react";
import { useCurrencies } from "../hooks/useCurrencies";
import { SecondProblem } from "../SecondProblem";
import { Spin } from "antd";

export const ThirdProblem = () => {
  const { currencies } = useCurrencies();

  const filteredCurrencies = useMemo(() => {
    if (Array.isArray(currencies)) {
      return currencies.filter((c) => c.price > 0);
    }

    return [];
  }, [currencies]);

  const sortedCurrencies = useMemo(() => {
    return filteredCurrencies.sort((l, r) => r.price - l.price);
  }, [filteredCurrencies]);

  if (!currencies) {
    return <Spin size="large" />;
  }

  return <SecondProblem currencies={sortedCurrencies} />;
};
