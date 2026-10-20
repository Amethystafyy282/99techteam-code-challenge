import { Button } from '../shared/components/Button';
import { Card, CardHeader } from '../shared/components/Card';
import { ArrowDownIcon } from '../shared/components/icons';
import { Spinner } from '../shared/components/Spinner';
import { useToast } from '../shared/hooks/useToast';
import type { Prices, WalletBalance } from '../shared/types';
import { formatAmount } from '../shared/utils/format';
import { getSwappableTokens } from '../shared/utils/token';
import type { SwapParams } from '../shared/utils/wallet';
import { TokenAmountField } from './components/TokenAmountField';
import { useForm } from './hooks/useForm';
import {
  convertAmount,
  getExchangeRate,
  INITIAL_SWAP_FORM_VALUES,
  parseAmount,
  sanitizeAmountInput,
  selectFromCurrency,
  selectToCurrency,
  switchCurrencies,
  toInputValue,
} from './utils/swap';
import { validateSwap } from './utils/validation';

interface SwapFormProps {
  prices: Prices;
  balances: WalletBalance[];
  isLoading: boolean;
  onSwap: (params: SwapParams) => Promise<void>;
}

export const SwapForm = ({ prices, balances, isLoading, onSwap }: SwapFormProps) => {
  const { values, setValue, setValues, isTouched, setIsTouched, isSubmitting, handleSubmit } =
    useForm(INITIAL_SWAP_FORM_VALUES);
  const { fromCurrency, toCurrency, amount } = values;
  const { showToast } = useToast();

  const handleAmountChange = (rawInput: string) => {
    const sanitizedAmount = sanitizeAmountInput(rawInput);

    if (sanitizedAmount === null) {
      return;
    }

    setValue('amount', sanitizedAmount);
    setIsTouched(true);
  };

  const handleAmountBlur = () => {
    if (amount !== '') {
      setIsTouched(true);
    }
  };

  const swappableTokens = getSwappableTokens(prices);
  const fromBalance = balances.find((walletBalance) => walletBalance.currency === fromCurrency)?.amount ?? 0;
  const exchangeRate = getExchangeRate(prices, fromCurrency, toCurrency);

  const sendAmount = parseAmount(amount);
  const receiveAmount = sendAmount !== null && exchangeRate !== null ? convertAmount(sendAmount, exchangeRate) : null;
  const sendUsdValue = sendAmount !== null && prices[fromCurrency] ? sendAmount * prices[fromCurrency] : null;
  const receiveUsdValue = receiveAmount !== null && prices[toCurrency] ? receiveAmount * prices[toCurrency] : null;

  const validationError = validateSwap({ amount, fromCurrency, toCurrency, balance: fromBalance, rate: exchangeRate });
  const amountError = isTouched ? validationError : null;
  const canSubmit =
    !isSubmitting && !isLoading && validationError === null && sendAmount !== null && receiveAmount !== null;

  const swapParams: SwapParams | null = canSubmit
    ? { fromCurrency, toCurrency, fromAmount: sendAmount, toAmount: receiveAmount }
    : null;

  const handleSwapSubmit = handleSubmit(
    swapParams &&
      (async () => {
        try {
          await onSwap(swapParams);
        } catch (error) {
          showToast(error instanceof Error ? error.message : 'Swap failed', 'error');
          return;
        }

        setValue('amount', '');
        showToast(
          `Swapped ${formatAmount(swapParams.fromAmount)} ${fromCurrency} for ${formatAmount(swapParams.toAmount)} ${toCurrency}`,
        );
      }),
  );

  return (
    <Card as="form" onSubmit={handleSwapSubmit} noValidate className="max-w-md">
      <CardHeader title="Swap">
        {isLoading && (
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Spinner /> Loading
          </span>
        )}
      </CardHeader>

      <div className="relative flex flex-col gap-3">
        <TokenAmountField
          id="input-amount"
          label="Amount to send"
          amount={amount}
          currency={fromCurrency}
          tokens={swappableTokens}
          usdValue={sendUsdValue}
          onCurrencyChange={(currency) => setValues(selectFromCurrency(values, currency))}
          onAmountChange={handleAmountChange}
          balance={fromBalance}
          onMax={() => handleAmountChange(toInputValue(fromBalance))}
          onBlur={handleAmountBlur}
          error={amountError}
          disabled={isSubmitting}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => setValues(switchCurrencies(values))}
          disabled={isSubmitting}
          aria-label="Switch tokens"
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 hover:rotate-180"
        >
          <ArrowDownIcon />
        </Button>

        <TokenAmountField
          id="output-amount"
          label="Amount to receive"
          amount={receiveAmount !== null ? toInputValue(receiveAmount) : ''}
          currency={toCurrency}
          tokens={swappableTokens}
          usdValue={receiveUsdValue}
          onCurrencyChange={(currency) => setValues(selectToCurrency(values, currency))}
          disabled={isSubmitting}
        />
      </div>

      <p className="flex h-11 items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <span>Rate</span>

        <span className="truncate font-medium text-slate-700 dark:text-slate-200">
          {exchangeRate !== null ? `1 ${fromCurrency} ≈ ${formatAmount(exchangeRate)} ${toCurrency}` : '—'}
        </span>
      </p>

      <Button type="submit" size="lg" isLoading={isSubmitting} disabled={!canSubmit} className="w-full">
        {isSubmitting ? 'SWAPPING…' : 'CONFIRM SWAP'}
      </Button>
    </Card>
  );
};
