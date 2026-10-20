import { useMemo, type HTMLAttributes } from 'react';
import type { Prices, WalletBalance } from '../shared/types';
import { Card, CardHeader } from '../shared/components/Card';
import { Skeleton } from '../shared/components/Skeleton';
import { cn } from '../shared/utils/cn';
import { formatUsd } from '../shared/utils/format';
import { formatBalances, sortBalancesByPriority } from './utils/balances';
import { WalletList } from './components/WalletList';

interface WalletPageProps extends HTMLAttributes<HTMLElement> {
  balances: WalletBalance[];
  prices: Prices;
  isLoading: boolean;
}

export const WalletPage = ({ balances, prices, isLoading, className, ...rest }: WalletPageProps) => {
  const sortedBalances = useMemo(() => sortBalancesByPriority(balances), [balances]);
  const formattedBalances = useMemo(() => formatBalances(sortedBalances, prices), [sortedBalances, prices]);

  const totalUsdValue = useMemo(
    () => formattedBalances.reduce((sum, balance) => sum + balance.usdValue, 0),
    [formattedBalances],
  );

  return (
    <Card as="section" className={cn('max-w-md lg:contain-size', className)} {...rest}>
      <CardHeader title="Wallet">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{formatUsd(totalUsdValue)}</span>
        )}
      </CardHeader>

      <div className="lg:[container-type:size] lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <WalletList balances={formattedBalances} isLoading={isLoading} />
      </div>
    </Card>
  );
};
