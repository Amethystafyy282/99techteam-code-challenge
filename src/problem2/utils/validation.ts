import { SWAP_ERROR_MESSAGES } from '../constants/swap';
import { parseAmount } from './swap';

interface SwapValidationInput {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  balance: number;
  rate: number | null;
}

export const validateSwap = ({
  amount,
  fromCurrency,
  toCurrency,
  balance,
  rate,
}: SwapValidationInput): string | null => {
  if (fromCurrency === toCurrency) {
    return SWAP_ERROR_MESSAGES.sameToken;
  }

  if (rate === null) {
    return SWAP_ERROR_MESSAGES.missingPrice;
  }

  if (amount.trim() === '') {
    return SWAP_ERROR_MESSAGES.required;
  }

  const parsedAmount = parseAmount(amount);

  if (parsedAmount === null) {
    return SWAP_ERROR_MESSAGES.invalid;
  }

  if (parsedAmount <= 0) {
    return SWAP_ERROR_MESSAGES.nonPositive;
  }

  if (parsedAmount > balance) {
    return SWAP_ERROR_MESSAGES.insufficient(fromCurrency);
  }

  return null;
};
