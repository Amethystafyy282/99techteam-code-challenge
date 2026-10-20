import { useCallback, useRef, useState } from 'react';
import { Button } from '../../shared/components/Button';
import { ChevronDownIcon } from '../../shared/components/icons';
import { TokenIcon } from '../../shared/components/TokenIcon';
import type { Currency } from '../../shared/constants/tokens';
import { useClickOutside } from '../../shared/hooks/useClickOutside';
import { cn } from '../../shared/utils/cn';

interface TokenSelectProps {
  label: string;
  value: Currency;
  tokens: Currency[];
  onChange: (currency: Currency) => void;
  disabled?: boolean;
}

export const TokenSelect = ({ label, value, tokens, onChange, disabled }: TokenSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  useClickOutside(containerRef, closeMenu, isOpen);

  const handleTokenSelect = (currency: Currency) => {
    onChange(currency);
    closeMenu();
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={(event) => event.key === 'Escape' && closeMenu()}>
      <Button
        variant="outline"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
      >
        <TokenIcon currency={value} />

        <span>{value}</span>

        <ChevronDownIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </Button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-20 mt-2 max-h-64 w-44 overflow-auto rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:shadow-black/40 dark:ring-slate-700"
        >
          {tokens.map((token) => (
            <li key={token} role="option" aria-selected={token === value}>
              <button
                type="button"
                onClick={() => handleTokenSelect(token)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-700',
                  token === value && 'bg-slate-100 font-semibold dark:bg-slate-700',
                )}
              >
                <TokenIcon currency={token} className="h-5 w-5" />

                {token}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
