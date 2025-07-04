interface Props {
  noOfTest: string;
  onInputChange: (n: number) => number;
  value: number;
}

export const FirstProblemWrapper = ({
  noOfTest,
  onInputChange,
  value,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl font-medium text-blue-950">{`First Problem #${noOfTest}`}</div>
        <div className="text-blue-950 text-xl">Total: {value}</div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-blue-950 text-base">Algorithm:</div>
        <mark>{onInputChange.toString()}</mark>
      </div>
    </div>
  );
};
