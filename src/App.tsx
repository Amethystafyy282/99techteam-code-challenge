import { SwapForm } from './problem2';
import { WalletPage } from './problem3';
import { ThemeToggle } from './shared/components/ThemeToggle';
import { usePrices } from './shared/hooks/usePrices';
import { useWalletBalances } from './shared/hooks/useWalletBalances';

const App = () => {
  const { prices, isLoading: isPricesLoading } = usePrices();
  const { balances, isLoading: isWalletLoading, swap } = useWalletBalances();
  const isLoading = isPricesLoading || isWalletLoading;

  return (
    <main className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-8 bg-linear-to-br from-slate-100 to-indigo-100 px-4 py-10 font-sans dark:from-slate-950 dark:to-indigo-950">
      <header className="relative flex w-full max-w-md items-center justify-center lg:max-w-[57.5rem]">
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-50">Currency Swap</h1>

        <ThemeToggle className="absolute right-0" />
      </header>

      <div className="flex w-full max-w-5xl flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-center">
        <SwapForm prices={prices} balances={balances} isLoading={isLoading} onSwap={swap} />

        <WalletPage balances={balances} prices={prices} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default App;
