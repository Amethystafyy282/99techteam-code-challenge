import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <span aria-hidden className={cn('block animate-pulse rounded bg-slate-200 dark:bg-slate-700', className)} />
);
