import { Currency } from "../hooks/useCurrencies";

interface Props {
  firstCurrency: Currency;
  secondCurrency: Currency;
}

export const CurrencyBaseComparison = ({
  firstCurrency,
  secondCurrency,
}: Props) => {
  return (
    <div className="flex flex-col text-base text-gray-600 font-medium">
      {[
        {
          from: firstCurrency.currency,
          to: secondCurrency.currency,
          rate: firstCurrency.price / secondCurrency.price,
        },
        {
          from: secondCurrency.currency,
          to: firstCurrency.currency,
          rate: secondCurrency.price / firstCurrency.price,
        },
      ].map(({ from, to, rate }) => {
        return (
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2">
              <div>1</div>
              <div>{from}</div>
            </div>
            <div>=</div>
            <div className="flex flex-row gap-2">
              <div>{rate}</div>
              <div>{to}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
