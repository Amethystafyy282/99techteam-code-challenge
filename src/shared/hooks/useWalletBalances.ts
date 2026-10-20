import { useCallback } from 'react';
import { fetchWalletBalances, swapBalances } from '../services/walletService';
import type { WalletBalance } from '../types';
import { mergeBalances, type SwapParams } from '../utils/wallet';
import { useFetchOnMount } from './useFetchOnMount';

const EMPTY_BALANCES: WalletBalance[] = [];

export const useWalletBalances = () => {
  const { data: balances, setData, isLoading } = useFetchOnMount(fetchWalletBalances, EMPTY_BALANCES);

  const swap = useCallback(
    async (params: SwapParams) => {
      const changedBalances = await swapBalances(params);
      setData((current) => mergeBalances(current, changedBalances));
    },
    [setData],
  );

  return { balances, isLoading, swap };
};
