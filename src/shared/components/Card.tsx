import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';
import { cn } from '../utils/cn';

type CardProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

export const Card = <T extends ElementType = 'div'>({ as, className, ...rest }: CardProps<T>) => {
  const Component: ElementType = as ?? 'div';

  return (
    <Component
      className={cn(
        'flex w-full flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-black/30 dark:ring-slate-800',
        className,
      )}
      {...rest}
    />
  );
};

interface CardHeaderProps extends PropsWithChildren {
  title: string;
}

export const CardHeader = ({ title, children }: CardHeaderProps) => (
  <div className="flex h-7 items-center justify-between">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>

    {children}
  </div>
);
