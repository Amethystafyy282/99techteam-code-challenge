import { MIN_REQUEST_DURATION_MS, WALLET_API_PAGE_SIZE, WALLET_API_URL } from '../constants/api';
import { BLOCKCHAIN_BY_CURRENCY } from '../constants/tokens';
import type { WalletBalance } from '../types';
import { withMinDuration } from '../utils/delay';
import { isSupportedCurrency } from '../utils/token';
import type { SwapParams } from '../utils/wallet';

interface ApiBalance {
  id: string;
  currency: string;
  blockchain: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiListResponse {
  data: ApiBalance[];
  meta: { total: number; limit: number; offset: number };
}

interface ApiSwapResponse {
  data: { from: ApiBalance; to: ApiBalance };
}

interface ApiErrorResponse {
  error?: { message?: string };
}

const requestJson = async <TResponse>(url: string, init: RequestInit, failureMessage: string): Promise<TResponse> => {
  const response = await withMinDuration(fetch(url, init), MIN_REQUEST_DURATION_MS, init.signal ?? undefined);
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = (body as ApiErrorResponse | null)?.error?.message;
    const hint = response.status >= 500 && !apiMessage ? '. Is the wallet API running?' : '';
    throw new Error(apiMessage ?? `${failureMessage}${hint} (HTTP ${response.status})`);
  }

  return body as TResponse;
};

const toWalletBalance = ({ currency, blockchain, amount }: ApiBalance): WalletBalance | null =>
  isSupportedCurrency(currency) && blockchain === BLOCKCHAIN_BY_CURRENCY[currency]
    ? { currency, blockchain: BLOCKCHAIN_BY_CURRENCY[currency], amount }
    : null;

const toWalletBalances = (apiBalances: ApiBalance[]): WalletBalance[] =>
  apiBalances.map(toWalletBalance).filter((balance): balance is WalletBalance => balance !== null);

export const fetchWalletBalances = async (signal?: AbortSignal): Promise<WalletBalance[]> => {
  const apiBalances: ApiBalance[] = [];
  let total = Infinity;

  while (apiBalances.length < total) {
    const searchParams = new URLSearchParams({
      sortBy: 'createdAt',
      limit: String(WALLET_API_PAGE_SIZE),
      offset: String(apiBalances.length),
    });

    const page = await requestJson<ApiListResponse>(
      `${WALLET_API_URL}?${searchParams}`,
      { signal },
      'Failed to load wallet balances',
    );

    apiBalances.push(...page.data);
    total = page.meta.total;

    if (page.data.length === 0) {
      break;
    }
  }

  return toWalletBalances(apiBalances);
};

export const swapBalances = async ({
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
}: SwapParams): Promise<WalletBalance[]> => {
  const { data } = await requestJson<ApiSwapResponse>(
    `${WALLET_API_URL}/swap`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: { currency: fromCurrency, blockchain: BLOCKCHAIN_BY_CURRENCY[fromCurrency], amount: fromAmount },
        to: { currency: toCurrency, blockchain: BLOCKCHAIN_BY_CURRENCY[toCurrency], amount: toAmount },
      }),
    },
    'Swap failed',
  );

  return toWalletBalances([data.from, data.to]);
};
