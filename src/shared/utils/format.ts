const amountFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatAmount = (value: number): string => amountFormatter.format(value);

export const formatUsd = (value: number): string => usdFormatter.format(value);
