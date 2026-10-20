import type { Currency } from '../../shared/constants/tokens';
import { roundAmount } from '../../shared/utils/number';
import type { Prices } from '../../shared/types';
import { DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY, MAX_INPUT_DECIMALS } from '../constants/swap';

export interface SwapFormValues {
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
}

export const INITIAL_SWAP_FORM_VALUES: SwapFormValues = {
  fromCurrency: DEFAULT_FROM_CURRENCY,
  toCurrency: DEFAULT_TO_CURRENCY,
  amount: '',
};

export const selectFromCurrency = (values: SwapFormValues, currency: Currency): SwapFormValues => ({
  ...values,
  fromCurrency: currency,
  toCurrency: currency === values.toCurrency ? values.fromCurrency : values.toCurrency,
});

export const selectToCurrency = (values: SwapFormValues, currency: Currency): SwapFormValues => ({
  ...values,
  toCurrency: currency,
  fromCurrency: currency === values.fromCurrency ? values.toCurrency : values.fromCurrency,
});

export const switchCurrencies = (values: SwapFormValues): SwapFormValues => ({
  ...values,
  fromCurrency: values.toCurrency,
  toCurrency: values.fromCurrency,
});

const AMOUNT_INPUT_PATTERN = new RegExp(`^\\d*\\.?\\d{0,${MAX_INPUT_DECIMALS}}$`);

export const sanitizeAmountInput = (rawInput: string): string | null => {
  const normalizedInput = rawInput.replace(',', '.');
  return AMOUNT_INPUT_PATTERN.test(normalizedInput) ? normalizedInput : null;
};

export const parseAmount = (value: string): number | null => {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const toInputValue = (value: number): string => value.toFixed(MAX_INPUT_DECIMALS).replace(/\.?0+$/, '');

export const getExchangeRate = (prices: Prices, fromCurrency: string, toCurrency: string): number | null => {
  const fromPrice = prices[fromCurrency];
  const toPrice = prices[toCurrency];

  if (!fromPrice || !toPrice) {
    return null;
  }

  return fromPrice / toPrice;
};

export const convertAmount = (amount: number, rate: number): number => roundAmount(amount * rate);
