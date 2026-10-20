import type { FormattedWalletBalance, Prices, WalletBalance } from '../../shared/types';
import { formatAmount } from '../../shared/utils/format';
import { UNKNOWN_PRIORITY } from '../constants/priority';
import { getPriority } from './priority';

export const sortBalancesByPriority = (balances: WalletBalance[]): WalletBalance[] =>
  balances
    .map((balance) => ({ balance, priority: getPriority(balance.blockchain) }))
    .filter(({ balance, priority }) => priority > UNKNOWN_PRIORITY && balance.amount > 0)
    .sort((lhs, rhs) => rhs.priority - lhs.priority)
    .map(({ balance }) => balance);

export const formatBalances = (balances: WalletBalance[], prices: Prices): FormattedWalletBalance[] =>
  balances.map((balance) => ({
    ...balance,
    formatted: formatAmount(balance.amount),
    usdValue: (prices[balance.currency] ?? 0) * balance.amount,
  }));
