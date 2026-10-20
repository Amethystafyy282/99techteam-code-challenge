import { useState } from 'react';
import { cn } from '../utils/cn';
import { getTokenIconUrl } from '../utils/token';

interface TokenIconProps {
  currency: string;
  className?: string;
}

export const TokenIcon = ({ currency, className = 'h-6 w-6' }: TokenIconProps) => {
  const iconUrl = getTokenIconUrl(currency);
  const [failedIconUrl, setFailedIconUrl] = useState<string | null>(null);

  if (failedIconUrl === iconUrl) {
    return (
      <span
        aria-hidden
        className={cn(
          className,
          'inline-flex shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        )}
      >
        {currency.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={iconUrl}
      alt=""
      className={cn(className, 'shrink-0 rounded-full')}
      onError={() => setFailedIconUrl(iconUrl)}
    />
  );
};
