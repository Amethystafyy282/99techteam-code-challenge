import { Button } from '../../shared/components/Button';
import { WalletIcon } from '../../shared/components/icons';
import type { Currency } from '../../shared/constants/tokens';
import { cn } from '../../shared/utils/cn';
import { formatAmount, formatUsd } from '../../shared/utils/format';
import { TokenSelect } from './TokenSelect';

interface TokenAmountFieldProps {
  id: string;
  label: string;
  amount: string;
  currency: Currency;
  tokens: Currency[];
  usdValue: number | null;
  onCurrencyChange: (currency: Currency) => void;
  onAmountChange?: (value: string) => void;
  balance?: number;
  onMax?: () => void;
  onBlur?: () => void;
  error?: string | null;
  disabled?: boolean;
}

export const TokenAmountField = ({
  id,
  label,
  amount,
  currency,
  tokens,
  usdValue,
  onCurrencyChange,
  onAmountChange,
  balance,
  onMax,
  onBlur,
  error,
  disabled = false,
}: TokenAmountFieldProps) => {
  const errorId = `${id}-error`;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-slate-50 p-5 ring-1 transition focus-within:ring-2 dark:bg-slate-800',
        error
          ? 'ring-red-400 focus-within:ring-red-500 dark:ring-red-500/70 dark:focus-within:ring-red-400'
          : 'ring-slate-200 focus-within:ring-indigo-500 dark:ring-slate-700 dark:focus-within:ring-indigo-400',
      )}
    >
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <label htmlFor={id}>{label}</label>

        {balance !== undefined && (
          <span className="flex items-center gap-1.5">
            <WalletIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />

            <span>Balance:</span>

            <span className="font-semibold text-slate-900 dark:text-slate-100">{`${formatAmount(balance)} ${currency}`}</span>

            {onMax && (
              <Button variant="soft" size="xs" onClick={onMax} disabled={disabled} className="ml-1">
                MAX
              </Button>
            )}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.0"
          value={amount}
          readOnly={!onAmountChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onAmountChange?.(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 bg-transparent text-2xl font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <TokenSelect
          label={`${label} token`}
          value={currency}
          tokens={tokens}
          onChange={onCurrencyChange}
          disabled={disabled}
        />
      </div>

      <div className="flex h-5 items-center justify-between gap-3 text-sm">
        <span className="shrink-0 text-slate-500 dark:text-slate-400">
          {usdValue !== null ? `≈ ${formatUsd(usdValue)}` : amount === '' && formatUsd(0)}
        </span>

        {error && (
          <span id={errorId} role="alert" className="truncate text-red-600 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};
