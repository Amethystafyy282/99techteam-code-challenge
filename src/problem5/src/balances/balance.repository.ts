import { randomUUID } from 'node:crypto';
import type { SqlValue } from 'sql.js';
import type { AppDatabase } from '../db/database.js';
import { NotFoundError, UnprocessableError } from '../errors.js';
import type {
  Blockchain,
  CreateBalanceInput,
  ListBalancesQuery,
  SortableField,
  SwapBalancesInput,
  UpdateBalanceInput,
} from './balance.schema.js';

const AMOUNT_PRECISION = 8;

const roundAmount = (value: number): number => Number(value.toFixed(AMOUNT_PRECISION));

export interface Balance {
  id: string;
  currency: string;
  blockchain: Blockchain;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface BalanceRow {
  id: string;
  currency: string;
  blockchain: Blockchain;
  amount: number;
  created_at: string;
  updated_at: string;
}

const SORT_COLUMN_BY_FIELD: Record<SortableField, string> = {
  amount: 'amount',
  currency: 'currency',
  blockchain: 'blockchain',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const toBalance = (row: BalanceRow): Balance => ({
  id: row.id,
  currency: row.currency,
  blockchain: row.blockchain,
  amount: row.amount,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createBalanceRepository = (database: AppDatabase) => {
  const findById = (id: string): Balance | null => {
    const [row] = database.all<BalanceRow>('SELECT * FROM balances WHERE id = ?', [id]);
    return row ? toBalance(row) : null;
  };

  const findByCurrency = (blockchain: Blockchain, currency: string): Balance | null => {
    const [row] = database.all<BalanceRow>('SELECT * FROM balances WHERE blockchain = ? AND currency = ?', [
      blockchain,
      currency,
    ]);

    return row ? toBalance(row) : null;
  };

  const list = ({ currency, blockchain, minAmount, maxAmount, sortBy, order, limit, offset }: ListBalancesQuery) => {
    const conditions: string[] = [];
    const params: SqlValue[] = [];

    if (currency !== undefined) {
      conditions.push('currency = ?');
      params.push(currency);
    }

    if (blockchain !== undefined) {
      conditions.push('blockchain = ?');
      params.push(blockchain);
    }

    if (minAmount !== undefined) {
      conditions.push('amount >= ?');
      params.push(minAmount);
    }

    if (maxAmount !== undefined) {
      conditions.push('amount <= ?');
      params.push(maxAmount);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = `ORDER BY ${SORT_COLUMN_BY_FIELD[sortBy]} ${order === 'desc' ? 'DESC' : 'ASC'}, id ASC`;

    const [countRow] = database.all<{ total: number }>(`SELECT COUNT(*) AS total FROM balances ${where}`, params);
    const rows = database.all<BalanceRow>(`SELECT * FROM balances ${where} ${orderBy} LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      offset,
    ]);

    return { data: rows.map(toBalance), total: countRow?.total ?? 0 };
  };

  const create = ({ currency, blockchain, amount }: CreateBalanceInput): Balance => {
    const now = new Date().toISOString();
    const balance: Balance = { id: randomUUID(), currency, blockchain, amount, createdAt: now, updatedAt: now };

    database.run(
      'INSERT INTO balances (id, currency, blockchain, amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [balance.id, balance.currency, balance.blockchain, balance.amount, balance.createdAt, balance.updatedAt],
    );

    return balance;
  };

  const update = (existing: Balance, changes: UpdateBalanceInput): Balance => {
    const updated: Balance = { ...existing, ...changes, updatedAt: new Date().toISOString() };

    database.run('UPDATE balances SET currency = ?, blockchain = ?, amount = ?, updated_at = ? WHERE id = ?', [
      updated.currency,
      updated.blockchain,
      updated.amount,
      updated.updatedAt,
      updated.id,
    ]);

    return updated;
  };

  const remove = (id: string): boolean => database.run('DELETE FROM balances WHERE id = ?', [id]) > 0;

  const swap = ({ from, to }: SwapBalancesInput) =>
    database.transaction(() => {
      const source = findByCurrency(from.blockchain, from.currency);

      if (!source) {
        throw new NotFoundError(`No ${from.currency} balance on ${from.blockchain}`);
      }

      if (source.amount < from.amount) {
        throw new UnprocessableError(`Insufficient ${from.currency} balance`);
      }

      const updatedSource = update(source, { amount: roundAmount(source.amount - from.amount) });
      const target = findByCurrency(to.blockchain, to.currency);
      const updatedTarget = target
        ? update(target, { amount: roundAmount(target.amount + to.amount) })
        : create({ currency: to.currency, blockchain: to.blockchain, amount: roundAmount(to.amount) });

      return { from: updatedSource, to: updatedTarget };
    });

  return { findById, findByCurrency, list, create, update, remove, swap };
};

export type BalanceRepository = ReturnType<typeof createBalanceRepository>;
