import { Skeleton } from '../../shared/components/Skeleton';

export const WalletRowSkeleton = () => (
  <li aria-hidden className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 lg:py-0">
    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-16" />

      <Skeleton className="h-3 w-20 bg-slate-100 dark:bg-slate-800" />
    </div>

    <div className="flex flex-col items-end space-y-2">
      <Skeleton className="h-4 w-20" />

      <Skeleton className="h-3 w-14 bg-slate-100 dark:bg-slate-800" />
    </div>
  </li>
);
