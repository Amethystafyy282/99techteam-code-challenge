import { Currency } from '../../shared/constants/tokens';

export const DEFAULT_FROM_CURRENCY = Currency.ETH;
export const DEFAULT_TO_CURRENCY = Currency.USDC;

export const MAX_INPUT_DECIMALS = 8;

export const SWAP_ERROR_MESSAGES = {
  required: 'Enter an amount to swap',
  invalid: 'Enter a valid number',
  nonPositive: 'Amount must be greater than 0',
  insufficient: (currency: string) => `Insufficient ${currency} balance`,
  sameToken: 'Choose two different tokens',
  missingPrice: 'Price unavailable for this pair',
} as const;
