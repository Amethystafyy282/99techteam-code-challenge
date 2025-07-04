import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input } from "antd";
import { SwapOutlined, SyncOutlined } from "@ant-design/icons";
import { CurrencySelector } from "./currencySelector";
import { useNumber } from "../hooks/useNumber";
import clsx from "clsx";
import { Currency } from "../hooks/useCurrencies";
import { CurrencyList } from "./currencyList";
import { Divider } from "../components/divider";
import { CurrencyBaseComparison } from "./currencyBaseComparison";
import { ConfirmModal } from "../components/confirmModal";
import { useNotification } from "../hooks/useNotification";

interface Props {
  currencies: Array<Currency>;
}
export const SecondProblem = ({ currencies }: Props) => {
  const { contextHolder, openNotification } = useNotification();
  const { isNumber } = useNumber();

  const [isLoading, setLoading] = useState(false);
  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false);

  const [transformFromCurrencyId, setTransformFromCurrencyId] =
    useState<string>("");

  const [transformToCurrencyId, setTransformToCurrencyId] =
    useState<string>("");

  useEffect(() => {
    if (currencies.length) {
      const [first, second] = currencies;
      setTransformFromCurrencyId(first.currency);
      setTransformToCurrencyId(second.currency);
    }
  }, []);

  const [exchangeAmount, setExchangeAmount] = useState<string>("");

  const parsedExchangeAmount: number = useMemo(() => {
    if (isNumber(exchangeAmount)) {
      return Number(exchangeAmount);
    }

    return 0;
  }, [exchangeAmount]);

  const transformFromCurrencyDetail = useMemo(
    () =>
      Array.isArray(currencies)
        ? currencies.find((c) => c.currency === transformFromCurrencyId)
        : undefined,
    [currencies, transformFromCurrencyId],
  );

  const transformToCurrencyDetail = useMemo(
    () =>
      Array.isArray(currencies)
        ? currencies.find((c) => c.currency === transformToCurrencyId)
        : undefined,
    [currencies, transformToCurrencyId],
  );

  const exchangedAmount = useMemo(() => {
    if (transformFromCurrencyDetail && transformToCurrencyDetail) {
      return (
        parsedExchangeAmount *
        (transformFromCurrencyDetail.price / transformToCurrencyDetail.price)
      );
    }

    return 0;
  }, [
    transformFromCurrencyDetail,
    transformToCurrencyDetail,
    parsedExchangeAmount,
  ]);

  const exchangeAmountError = useMemo(() => {
    if (!exchangeAmount) {
      return "This field is required";
    }

    if (!isNumber(exchangeAmount)) {
      return "Exchange amount must be a number!";
    }
  }, [exchangeAmount]);

  const handleTransformFromCurrencyChange = useCallback(
    (newCurr: string) => {
      if (newCurr === transformToCurrencyId) {
        setTransformToCurrencyId(transformFromCurrencyId);
      }

      setTransformFromCurrencyId(newCurr);
    },
    [transformFromCurrencyId, transformToCurrencyId],
  );

  const handleTransformToCurrencyChange = useCallback(
    (newCurr: string) => {
      if (newCurr === transformFromCurrencyId) {
        setTransformFromCurrencyId(transformToCurrencyId);
      }

      setTransformToCurrencyId(newCurr);
    },
    [transformFromCurrencyId, transformToCurrencyId],
  );

  const handleSwapFromAndTo = useCallback(() => {
    const currentFirstCurrencyId = transformFromCurrencyId;
    const currentSecondCurrencyId = transformToCurrencyId;

    setTransformFromCurrencyId(currentSecondCurrencyId);
    setTransformToCurrencyId(currentFirstCurrencyId);
  }, [transformFromCurrencyId, transformToCurrencyId]);

  const mappedCurrencyOptions = useMemo(() => {
    if (Array.isArray(currencies)) {
      return currencies.map((currency) => {
        return {
          value: currency.currency,
          label: currency.currency,
        };
      });
    }

    return [];
  }, [currencies]);

  const splitResultAmount = useMemo(() => {
    const [integer, decimal] = exchangedAmount.toString().split(".");

    const splitIndex = 4;

    return {
      first: `${integer}.${decimal ? decimal.slice(0, splitIndex) : "0000"}`,
      second: decimal ? decimal.slice(splitIndex) : "00000000",
    };
  }, [exchangedAmount]);

  const swapCurrency = () => {
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
        setLoading(false);
        openNotification("Successfully", "Swapped successfully");
      }, 3000);
    });
  };

  const handleSubmit = () => {
    setOpenConfirmModal(true);
  };

  return (
    <div>
      {contextHolder}
      <div className="flex flex-col gap-4 h-full bg-white rounded-lg border-4 border-blue-950 p-10 w-2/3 justify-self-center">
        <div className="flex flex-row gap-4 justify-end items-end">
          <div className="flex flex-col w-1/3">
            <div className="flex flex-col gap-2">
              <div className="text-xl font-medium">Amount</div>
              <Input
                size="large"
                className="h-14"
                status={exchangeAmountError ? "error" : undefined}
                placeholder="Enter your amount to start conversion"
                value={exchangeAmount}
                onChange={(e) => {
                  setExchangeAmount(e.target.value.trim());
                }}
                onPressEnter={handleSubmit}
              />
            </div>
            {exchangeAmountError && (
              <div className="relative">
                <div className="absolute -bottom-8 left-0 text-red-600 font-bold text-base">
                  {exchangeAmountError}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-1/3">
            <div className="text-xl font-medium">From</div>
            <CurrencySelector
              currencyId={transformFromCurrencyId}
              currencyOptions={mappedCurrencyOptions}
              onCurrencyIdChange={handleTransformFromCurrencyChange}
            />
          </div>

          <SwapOutlined
            className="p-5 rounded-full bg-white border hover:bg-gray-300 cursor-pointer"
            onClick={handleSwapFromAndTo}
          />

          <div className="flex flex-col gap-2 w-1/3">
            <div className="text-xl font-medium">To</div>
            <CurrencySelector
              currencyId={transformToCurrencyId}
              currencyOptions={mappedCurrencyOptions}
              onCurrencyIdChange={handleTransformToCurrencyChange}
            />
          </div>
        </div>

        <div className="pt-7 pb-3 w-3/4 self-center">
          <Divider />
        </div>

        {transformFromCurrencyDetail && transformToCurrencyDetail && (
          <div className="flex flex-row justify-evenly items-center">
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 text-base text-gray-600 font-medium">
                <div>{parsedExchangeAmount.toFixed(2)}</div>
                <div>{transformFromCurrencyDetail.currency}</div>
                <div>=</div>
              </div>
              <div className="flex flex-row gap-2 text-2xl font-bold">
                <div className="flex flex-row">
                  <div>{splitResultAmount.first}</div>
                  <div className="text-gray-400">
                    {splitResultAmount.second}
                  </div>
                </div>
                <div>{transformToCurrencyDetail.currency}</div>
              </div>
            </div>

            <CurrencyBaseComparison
              firstCurrency={transformFromCurrencyDetail}
              secondCurrency={transformToCurrencyDetail}
            />
          </div>
        )}

        <Button
          type="primary"
          className={clsx(
            "h-14 w-1/6 self-center flex flex-row gap-2",
            isLoading && "opacity-50",
          )}
          onClick={handleSubmit}
          disabled={!!exchangeAmountError}
        >
          {isLoading && <SyncOutlined spin />}
          Submit
        </Button>

        <div className="py-5">
          <Divider />
        </div>

        <CurrencyList currencies={currencies} />
        <ConfirmModal
          title="Confirm to Swap"
          state={{ isOpen: isOpenConfirmModal, setOpen: setOpenConfirmModal }}
          onConfirm={swapCurrency}
        />
      </div>
    </div>
  );
};
