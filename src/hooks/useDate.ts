export const useDate = () => {
  const toFormattedDate = (dateValue: string) => {
    const date = new Date(dateValue);

    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  return {
    toFormattedDate,
  };
};
