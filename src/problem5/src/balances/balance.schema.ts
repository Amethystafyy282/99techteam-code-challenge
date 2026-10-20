import { z } from 'zod';

export const BLOCKCHAINS = ['Osmosis', 'Ethereum', 'Arbitrum', 'Zilliqa', 'Neo'] as const;

export const SORTABLE_FIELDS = ['amount', 'currency', 'blockchain', 'createdAt', 'updatedAt'] as const;

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

const currencySchema = z
  .string()
  .trim()
  .min(1, 'Currency is required')
  .max(20, 'Currency must be at most 20 characters')
  .regex(/^[A-Za-z0-9]+$/, 'Currency must contain only letters and digits');

const amountSchema = z.number().nonnegative('Amount must be 0 or more');

export const createBalanceSchema = z.strictObject({
  currency: currencySchema,
  blockchain: z.enum(BLOCKCHAINS),
  amount: amountSchema,
});

export const updateBalanceSchema = createBalanceSchema
  .partial()
  .refine((fields) => Object.keys(fields).length > 0, 'Provide at least one field to update');

const positiveAmountSchema = z.number().positive('Amount must be greater than 0');

export const swapBalancesSchema = z
  .strictObject({
    from: z.strictObject({ currency: currencySchema, blockchain: z.enum(BLOCKCHAINS), amount: positiveAmountSchema }),
    to: z.strictObject({ currency: currencySchema, blockchain: z.enum(BLOCKCHAINS), amount: positiveAmountSchema }),
  })
  .refine(({ from, to }) => from.currency !== to.currency || from.blockchain !== to.blockchain, {
    message: 'Choose two different balances',
    path: ['to'],
  });

export const balanceIdSchema = z.strictObject({ id: z.uuid('Balance id must be a UUID') });

export const listBalancesQuerySchema = z
  .strictObject({
    currency: currencySchema.optional(),
    blockchain: z.enum(BLOCKCHAINS).optional(),
    minAmount: z.coerce.number().nonnegative().optional(),
    maxAmount: z.coerce.number().nonnegative().optional(),
    sortBy: z.enum(SORTABLE_FIELDS).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('asc'),
    limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .refine(({ minAmount, maxAmount }) => minAmount === undefined || maxAmount === undefined || minAmount <= maxAmount, {
    message: 'minAmount must not be greater than maxAmount',
    path: ['minAmount'],
  });

export type CreateBalanceInput = z.infer<typeof createBalanceSchema>;
export type UpdateBalanceInput = z.infer<typeof updateBalanceSchema>;
export type ListBalancesQuery = z.infer<typeof listBalancesQuerySchema>;
export type SwapBalancesInput = z.infer<typeof swapBalancesSchema>;
export type Blockchain = (typeof BLOCKCHAINS)[number];
export type SortableField = (typeof SORTABLE_FIELDS)[number];
