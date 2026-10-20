import type { FormattedWalletBalance } from '../../shared/types';
import { SKELETON_ROW_COUNT } from '../constants/wallet';
import { WalletRow } from './WalletRow';
import { WalletRowSkeleton } from './WalletRowSkeleton';

const LIST_CLASS_NAME = 'divide-y divide-slate-100 dark:divide-slate-800 lg:grid lg:auto-rows-[calc(100cqh/6)]';

interface WalletListProps {
  balances: FormattedWalletBalance[];
  isLoading: boolean;
}

export const WalletList = ({ balances, isLoading }: WalletListProps) => {
  if (isLoading) {
    return (
      <ul aria-busy aria-label="Loading balances" className={LIST_CLASS_NAME}>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
          <WalletRowSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (balances.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No balances to show</p>;
  }

  return (
    <ul className={LIST_CLASS_NAME}>
      {balances.map((balance) => (
        <WalletRow key={`${balance.blockchain}-${balance.currency}`} balance={balance} />
      ))}
    </ul>
  );
};
