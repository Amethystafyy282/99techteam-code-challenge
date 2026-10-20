import { Router } from 'express';
import { ConflictError, NotFoundError, parseOrThrow } from '../errors.js';
import type { Balance, BalanceRepository } from './balance.repository.js';
import {
  balanceIdSchema,
  createBalanceSchema,
  listBalancesQuerySchema,
  swapBalancesSchema,
  updateBalanceSchema,
  type Blockchain,
} from './balance.schema.js';

export const createBalanceRouter = (repository: BalanceRepository) => {
  const router = Router();

  const findOrThrow = (id: string): Balance => {
    const balance = repository.findById(id);

    if (!balance) {
      throw new NotFoundError(`Balance ${id} not found`);
    }

    return balance;
  };

  const assertNoDuplicate = (blockchain: Blockchain, currency: string, ignoreId?: string) => {
    const duplicate = repository.findByCurrency(blockchain, currency);

    if (duplicate && duplicate.id !== ignoreId) {
      throw new ConflictError(`A ${currency} balance on ${blockchain} already exists (id ${duplicate.id})`);
    }
  };

  router.get('/', (req, res) => {
    const query = parseOrThrow(listBalancesQuerySchema, req.query);
    const { data, total } = repository.list(query);

    res.json({ data, meta: { total, limit: query.limit, offset: query.offset } });
  });

  router.get('/:id', (req, res) => {
    const { id } = parseOrThrow(balanceIdSchema, req.params);

    res.json({ data: findOrThrow(id) });
  });

  router.post('/', (req, res) => {
    const input = parseOrThrow(createBalanceSchema, req.body);
    assertNoDuplicate(input.blockchain, input.currency);
    const balance = repository.create(input);

    res.status(201).location(`${req.baseUrl}/${balance.id}`).json({ data: balance });
  });

  router.post('/swap', (req, res) => {
    const input = parseOrThrow(swapBalancesSchema, req.body);

    res.json({ data: repository.swap(input) });
  });

  router.patch('/:id', (req, res) => {
    const { id } = parseOrThrow(balanceIdSchema, req.params);
    const changes = parseOrThrow(updateBalanceSchema, req.body);
    const existing = findOrThrow(id);
    assertNoDuplicate(changes.blockchain ?? existing.blockchain, changes.currency ?? existing.currency, id);

    res.json({ data: repository.update(existing, changes) });
  });

  router.delete('/:id', (req, res) => {
    const { id } = parseOrThrow(balanceIdSchema, req.params);

    if (!repository.remove(id)) {
      throw new NotFoundError(`Balance ${id} not found`);
    }

    res.status(204).end();
  });

  return router;
};
