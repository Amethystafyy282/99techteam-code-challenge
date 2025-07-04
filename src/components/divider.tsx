import clsx from "clsx";

interface Props {
  className?: string;
}
export const Divider = ({ className }: Props) => {
  return <div className={clsx("h-px w-full bg-gray-500", className)} />;
};
