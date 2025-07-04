import { useFirstProblem } from "../hooks/useFirstProblem";
import { FirstProblemWrapper } from "./wrapper";

export const FirstProblem = () => {
  const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = useFirstProblem();

  return (
    <div className="flex flex-col gap-4">
      <FirstProblemWrapper
        title="First Problem #1"
        onInputChange={sum_to_n_a}
      />
      <FirstProblemWrapper
        title="First Problem #2"
        onInputChange={sum_to_n_b}
      />
      <FirstProblemWrapper
        title="First Problem #3"
        onInputChange={sum_to_n_c}
      />
    </div>
  );
};
