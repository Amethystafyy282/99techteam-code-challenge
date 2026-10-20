import type { Currency } from '../constants/tokens';
import type { WalletBalance } from '../types';

export interface SwapParams {
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
}

const isSameBalance = (a: WalletBalance, b: WalletBalance) =>
  a.currency === b.currency && a.blockchain === b.blockchain;

export const mergeBalances = (balances: WalletBalance[], changedBalances: WalletBalance[]): WalletBalance[] => {
  const added = changedBalances.filter((changed) => !balances.some((balance) => isSameBalance(balance, changed)));
  const updated = balances.map(
    (balance) => changedBalances.find((changed) => isSameBalance(balance, changed)) ?? balance,
  );

  return [...updated, ...added];
};
