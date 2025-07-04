import { useFirstProblem } from "../hooks/useFirstProblem";
import { FirstProblemWrapper } from "./wrapper";
import { Divider } from "../components/divider";
import { Input } from "antd";
import { useState } from "react";

export const FirstProblem = () => {
  const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = useFirstProblem();

  const [input, setInput] = useState<string>("");

  return (
    <div className="flex flex-col gap-4 bg-white border-4 border-blue-950 w-2/3 p-10 self-center rounded-lg">
      <div className="text-lg font-medium text-blue-950">
        Insert your number to calculate:
      </div>
      <Input
        className="h-14 w-1/5"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <FirstProblemWrapper
        noOfTest="1"
        onInputChange={sum_to_n_a}
        value={sum_to_n_a(Number(input))}
      />
      <Divider />
      <FirstProblemWrapper
        noOfTest="2"
        onInputChange={sum_to_n_b}
        value={sum_to_n_b(Number(input))}
      />
      <Divider />
      <FirstProblemWrapper
        noOfTest="3"
        onInputChange={sum_to_n_c}
        value={sum_to_n_c(Number(input))}
      />
    </div>
  );
};
