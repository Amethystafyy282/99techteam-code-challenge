import { TOKEN_ICON_BASE_URL } from '../constants/api';
import { Currency } from '../constants/tokens';
import type { Prices } from '../types';

const SUPPORTED_CURRENCIES = new Set<string>(Object.values(Currency));

export const isSupportedCurrency = (value: string): value is Currency => SUPPORTED_CURRENCIES.has(value);

export const getTokenIconUrl = (currency: string): string => `${TOKEN_ICON_BASE_URL}/${currency}.svg`;

export const getSwappableTokens = (prices: Prices): Currency[] =>
  Object.values(Currency)
    .filter((currency) => prices[currency] !== undefined)
    .sort((a, b) => a.localeCompare(b));
