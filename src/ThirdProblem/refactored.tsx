import { useEffect, useMemo, useState } from "react";
import { usePrices } from "../hooks/usePrices";
import { useWalletBalances, WalletBalance } from "../hooks/useWalletBalances";

const WalletPage = () => {
  const { fetchWalletBalance } = useWalletBalances();
  const { getPriceByCurrency } = usePrices();

  const [balances, setBalances] = useState<Array<WalletBalance>>(undefined); // TODO: Undefined value can be used as `isLoading`

  useEffect(() => {
    fetchWalletBalance().then(setBalances);
  }, []);

  const filteredBalances = useMemo(() => {
    if (Array.isArray(balances)) {
      return balances.filter((balance) => balance.amount > 0);
    }

    return [];
  }, [balances]);

  const sortedBalances = useMemo(() => {
    return filteredBalances.sort((lhs, rhs) => lhs.amount - rhs.amount);
  }, [filteredBalances]);

  return (
    <div>
      {sortedBalances.map((balance) => {
        const usdValue = getPriceByCurrency(balance.currency) * balance.amount;
        const fixedAmount = balance.amount.toFixed();

        return (
          <WalletRow
            key={balance.currency}
            currency={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            fixedAmount={fixedAmount}
          />
        );
      })}
    </div>
  );
};
