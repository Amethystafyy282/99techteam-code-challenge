import type { Blockchain, Currency } from '../constants/tokens';

export interface WalletBalance {
  currency: Currency;
  amount: number;
  blockchain: Blockchain;
}

export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

export interface PriceEntry {
  currency: string;
  date: string;
  price: number;
}

export type Prices = Record<string, number>;
