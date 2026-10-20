import { MIN_REQUEST_DURATION_MS, PRICES_URL } from '../constants/api';
import type { PriceEntry, Prices } from '../types';
import { withMinDuration } from '../utils/delay';
import { getLatestPrices } from '../utils/prices';

const requestPrices = async (signal?: AbortSignal): Promise<Prices> => {
  const response = await fetch(PRICES_URL, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load prices (HTTP ${response.status})`);
  }

  const priceEntries: PriceEntry[] = await response.json();
  return getLatestPrices(priceEntries);
};

export const fetchPrices = (signal?: AbortSignal): Promise<Prices> =>
  withMinDuration(requestPrices(signal), MIN_REQUEST_DURATION_MS, signal);
