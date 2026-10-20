import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

const VARIANT_CLASSES = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400',
  soft: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-50 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25 dark:hover:text-indigo-200',
  outline:
    'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700',
  ghost:
    'text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300',
} as const;

const SIZE_CLASSES = {
  xs: 'rounded-md px-2 py-0.5 text-xs',
  md: 'rounded-full px-3 py-1.5',
  lg: 'rounded-xl px-4 py-4',
  icon: 'rounded-full p-2',
  'icon-sm': 'rounded-md p-1',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed',
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    )}
    {...rest}
  >
    {isLoading && <Spinner />}

    {children}
  </button>
);
