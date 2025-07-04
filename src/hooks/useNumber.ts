export const useNumber = () => {
  const isNumber = (value: string) => {
    return /^-?\d*\.?\d+$/.test(value);
  };

  return {
    isNumber,
  };
};
