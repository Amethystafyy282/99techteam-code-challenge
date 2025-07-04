import { Currency } from "../hooks/useCurrencies";
import { useDate } from "../hooks/useDate";

interface Props {
  currencies: Array<Currency>;
}
export const CurrencyList = ({ currencies }: Props) => {
  const { toFormattedDate } = useDate();

  return (
    <div className="flex flex-col gap-10 self-center w-full">
      <div className="text-4xl text-center">Available currencies</div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center pb-5">
          <div className="w-1/3 text-xl font-medium">Currency</div>
          <div className="w-1/3 text-xl font-medium text-gray-600">Price</div>
          <div className="w-1/3 text-xl font-medium text-gray-600">
            Updated At
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {currencies.map((c) => {
            return (
              <div key={c.currency} className="flex flex-row justify-between">
                <div className="w-1/3 text-xl font-medium">{c.currency}</div>
                <div className="w-1/3 text-xl font-medium text-gray-600">
                  {c.price}
                </div>
                <div className="w-1/3 text-xl font-medium text-gray-600">
                  {toFormattedDate(c.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
