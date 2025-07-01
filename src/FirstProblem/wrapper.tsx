import { useMemo, useState } from "react";

interface Props {
  title: string;
  onInputChange: (n: number) => number;
}

export const FirstProblemWrapper = ({ title, onInputChange }: Props) => {
  const [input, setInput] = useState<number>(0);

  const sumNumber = useMemo(() => onInputChange(input), [input]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div>{title}</div>
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
        />
        <div>Total: {sumNumber}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "4px",
        }}
      >
        <div>Algorithm:</div>
        <div>{onInputChange.toString()}</div>
      </div>
    </div>
  );
};
