import { fetchPrices } from '../services/priceService';
import type { Prices } from '../types';
import { useFetchOnMount } from './useFetchOnMount';

const EMPTY_PRICES: Prices = {};

export const usePrices = () => {
  const { data: prices, isLoading } = useFetchOnMount(fetchPrices, EMPTY_PRICES);
  return { prices, isLoading };
};
