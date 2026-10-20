import type { PriceEntry, Prices } from '../types';

export const getLatestPrices = (entries: PriceEntry[]): Prices => {
  const latestEntryByCurrency = new Map<string, PriceEntry>();

  for (const entry of entries) {
    const latestEntry = latestEntryByCurrency.get(entry.currency);

    if (!latestEntry || Date.parse(entry.date) >= Date.parse(latestEntry.date)) {
      latestEntryByCurrency.set(entry.currency, entry);
    }
  }

  return Object.fromEntries([...latestEntryByCurrency].map(([currency, { price }]) => [currency, price]));
};
