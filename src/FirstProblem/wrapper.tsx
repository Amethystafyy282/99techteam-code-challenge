import { useMemo, useState } from "react";

interface Props {
  title: string;
  onInputChange: (n: number) => number;
}

export const FirstProblemWrapper = ({ title, onInputChange }: Props) => {
  const [input, setInput] = useState<number>(0);

  const sumNumber = useMemo(() => onInputChange(input), [input]);

  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold font-medium">{title}</div>
      <div className="flex flex-row gap-2 items-center">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          className="h-10 border border-black rounded-md px-2"
        />
        <div>Total: {sumNumber}</div>
      </div>
      <div className="flex flex-row gap-2">
        <div>Algorithm:</div>
        <mark>{onInputChange.toString()}</mark>
      </div>
    </div>
  );
};
