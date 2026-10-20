import { TokenIcon } from '../../shared/components/TokenIcon';
import type { FormattedWalletBalance } from '../../shared/types';
import { formatUsd } from '../../shared/utils/format';

interface WalletRowProps {
  balance: FormattedWalletBalance;
}

export const WalletRow = ({ balance }: WalletRowProps) => (
  <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 lg:py-0">
    <TokenIcon currency={balance.currency} className="h-9 w-9" />

    <div className="min-w-0 flex-1">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{balance.currency}</p>

      <p className="text-xs text-slate-500 dark:text-slate-400">{balance.blockchain}</p>
    </div>

    <div className="text-right">
      <p className="font-medium text-slate-900 dark:text-slate-100">{balance.formatted}</p>

      <p className="text-xs text-slate-500 dark:text-slate-400">{formatUsd(balance.usdValue)}</p>
    </div>
  </li>
);
