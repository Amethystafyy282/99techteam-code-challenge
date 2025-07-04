import { Select } from "antd";

interface Props {
  currencyId: string;
  onCurrencyIdChange: (newCurr: string) => void;
  currencyOptions: Array<{ value: string; label: string }>;
}
export const CurrencySelector = ({
  currencyId,
  onCurrencyIdChange,
  currencyOptions,
}: Props) => {
  return (
    <Select
      className="w-full h-14 text-2xl"
      suffixIcon={
        <img
          className="w-6 h-6"
          src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currencyId}.svg`}
          alt={currencyId}
        />
      }
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      defaultValue={currencyId}
      value={currencyId}
      onChange={(newCurr) => onCurrencyIdChange(newCurr)}
      options={currencyOptions}
      optionRender={(data) => {
        return (
          <div className="flex flex-row items-center justify-between h-10">
            <div>{data.value}</div>
            <img
              className="w-6 h-6"
              src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${data.value}.svg`}
              alt={data.value?.toString()}
            />
          </div>
        );
      }}
    />
  );
};
