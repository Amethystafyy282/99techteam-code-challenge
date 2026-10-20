import { AMOUNT_PRECISION } from '../constants/tokens';

export const roundAmount = (value: number, precision = AMOUNT_PRECISION): number => Number(value.toFixed(precision));
