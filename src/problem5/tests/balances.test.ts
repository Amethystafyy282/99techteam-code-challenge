import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createBalanceRepository } from '../src/balances/balance.repository.js';
import { IN_MEMORY, openDatabase } from '../src/db/database.js';

type App = ReturnType<typeof createApp>;

const createTestApp = async () => createApp(createBalanceRepository(await openDatabase(IN_MEMORY)));

const MISSING_ID = '00000000-0000-4000-8000-000000000000';

const createBalance = (app: App, body: object) => request(app).post('/api/balances').send(body);

describe('wallet balance API', () => {
  let app: App;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it('reports health', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  describe('POST /api/balances', () => {
    it('creates a balance', async () => {
      const response = await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1.5 });

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({ currency: 'ETH', blockchain: 'Ethereum', amount: 1.5 });
      expect(response.body.data.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(response.headers.location).toBe(`/api/balances/${response.body.data.id}`);
    });

    it('keeps the currency case as given', async () => {
      const response = await createBalance(app, { currency: 'bNEO', blockchain: 'Neo', amount: 30 });

      expect(response.body.data.currency).toBe('bNEO');
    });

    it('rejects a duplicate currency on the same chain', async () => {
      await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1 });
      const response = await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 2 });

      expect(response.status).toBe(409);
    });

    it('allows the same currency on a different chain', async () => {
      await createBalance(app, { currency: 'USDC', blockchain: 'Ethereum', amount: 1 });
      const response = await createBalance(app, { currency: 'USDC', blockchain: 'Arbitrum', amount: 1 });

      expect(response.status).toBe(201);
    });

    it('rejects invalid input and lists every problem', async () => {
      const response = await createBalance(app, { currency: 'ET H', blockchain: 'Bitcoin', amount: -1, extra: true });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Invalid request');
      const paths = response.body.error.details.map((detail: { path: string }) => detail.path);
      expect(paths).toEqual(expect.arrayContaining(['currency', 'blockchain', 'amount']));
    });

    it('rejects a missing field', async () => {
      const response = await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum' });

      expect(response.status).toBe(400);
      expect(response.body.error.details[0].path).toBe('amount');
    });

    it('rejects malformed JSON', async () => {
      const response = await request(app)
        .post('/api/balances')
        .set('Content-Type', 'application/json')
        .send('{"currency": ');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Request body is not valid JSON');
    });
  });

  describe('GET /api/balances', () => {
    beforeEach(async () => {
      await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1.5 });
      await createBalance(app, { currency: 'USDC', blockchain: 'Ethereum', amount: 2500 });
      await createBalance(app, { currency: 'OSMO', blockchain: 'Osmosis', amount: 1200 });
      await createBalance(app, { currency: 'ATOM', blockchain: 'Osmosis', amount: 0 });
    });

    it('lists every balance with pagination info', async () => {
      const response = await request(app).get('/api/balances');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(4);
      expect(response.body.meta).toEqual({ total: 4, limit: 20, offset: 0 });
    });

    it('filters by blockchain', async () => {
      const response = await request(app).get('/api/balances').query({ blockchain: 'Osmosis' });

      expect(response.body.data.map((balance: { currency: string }) => balance.currency).sort()).toEqual([
        'ATOM',
        'OSMO',
      ]);
    });

    it('filters by currency', async () => {
      const response = await request(app).get('/api/balances').query({ currency: 'USDC' });

      expect(response.body.meta.total).toBe(1);
      expect(response.body.data[0].currency).toBe('USDC');
    });

    it('filters by amount range', async () => {
      const response = await request(app).get('/api/balances').query({ minAmount: 1, maxAmount: 1500 });

      expect(response.body.data.map((balance: { currency: string }) => balance.currency).sort()).toEqual([
        'ETH',
        'OSMO',
      ]);
    });

    it('sorts by amount, descending', async () => {
      const response = await request(app).get('/api/balances').query({ sortBy: 'amount', order: 'desc' });

      expect(response.body.data.map((balance: { amount: number }) => balance.amount)).toEqual([2500, 1200, 1.5, 0]);
    });

    it('paginates with limit and offset, keeping the full total', async () => {
      const response = await request(app).get('/api/balances').query({ sortBy: 'amount', limit: 2, offset: 1 });

      expect(response.body.data.map((balance: { amount: number }) => balance.amount)).toEqual([1.5, 1200]);
      expect(response.body.meta).toEqual({ total: 4, limit: 2, offset: 1 });
    });

    it('rejects invalid query parameters', async () => {
      const response = await request(app).get('/api/balances').query({ limit: 500, sortBy: 'price', unknown: 1 });

      expect(response.status).toBe(400);
      const paths = response.body.error.details.map((detail: { path: string }) => detail.path);
      expect(paths).toEqual(expect.arrayContaining(['limit', 'sortBy']));
    });

    it('rejects a min amount above the max amount', async () => {
      const response = await request(app).get('/api/balances').query({ minAmount: 10, maxAmount: 1 });

      expect(response.status).toBe(400);
      expect(response.body.error.details[0].path).toBe('minAmount');
    });
  });

  describe('GET /api/balances/:id', () => {
    it('returns one balance', async () => {
      const created = await createBalance(app, { currency: 'GMX', blockchain: 'Arbitrum', amount: 10 });
      const response = await request(app).get(`/api/balances/${created.body.data.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(created.body.data);
    });

    it('returns 404 for an unknown id', async () => {
      const response = await request(app).get(`/api/balances/${MISSING_ID}`);

      expect(response.status).toBe(404);
    });

    it('returns 400 for an id that is not a UUID', async () => {
      const response = await request(app).get('/api/balances/not-a-uuid');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/balances/:id', () => {
    it('updates only the fields sent', async () => {
      const created = await createBalance(app, { currency: 'ZIL', blockchain: 'Zilliqa', amount: 50000 });
      const response = await request(app).patch(`/api/balances/${created.body.data.id}`).send({ amount: 42 });

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({ currency: 'ZIL', blockchain: 'Zilliqa', amount: 42 });
      expect(response.body.data.createdAt).toBe(created.body.data.createdAt);
      expect(Date.parse(response.body.data.updatedAt)).toBeGreaterThanOrEqual(Date.parse(created.body.data.updatedAt));

      const fetched = await request(app).get(`/api/balances/${created.body.data.id}`);
      expect(fetched.body.data.amount).toBe(42);
    });

    it('rejects an empty update', async () => {
      const created = await createBalance(app, { currency: 'ZIL', blockchain: 'Zilliqa', amount: 1 });
      const response = await request(app).patch(`/api/balances/${created.body.data.id}`).send({});

      expect(response.status).toBe(400);
    });

    it('rejects an update that would duplicate another balance', async () => {
      await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1 });
      const usdc = await createBalance(app, { currency: 'USDC', blockchain: 'Ethereum', amount: 1 });
      const response = await request(app).patch(`/api/balances/${usdc.body.data.id}`).send({ currency: 'ETH' });

      expect(response.status).toBe(409);
    });

    it('allows re-sending the balance’s own currency and chain', async () => {
      const created = await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1 });
      const response = await request(app)
        .patch(`/api/balances/${created.body.data.id}`)
        .send({ currency: 'ETH', blockchain: 'Ethereum', amount: 2 });

      expect(response.status).toBe(200);
    });

    it('returns 404 for an unknown id', async () => {
      const response = await request(app).patch(`/api/balances/${MISSING_ID}`).send({ amount: 1 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/balances/:id', () => {
    it('deletes a balance', async () => {
      const created = await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1 });
      const response = await request(app).delete(`/api/balances/${created.body.data.id}`);

      expect(response.status).toBe(204);
      expect((await request(app).get(`/api/balances/${created.body.data.id}`)).status).toBe(404);
    });

    it('returns 404 for an unknown id', async () => {
      const response = await request(app).delete(`/api/balances/${MISSING_ID}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/balances/swap', () => {
    const swap = (body: object) => request(app).post('/api/balances/swap').send(body);
    const getByCurrency = async (currency: string) =>
      (await request(app).get('/api/balances').query({ currency })).body.data[0];

    beforeEach(async () => {
      await createBalance(app, { currency: 'ETH', blockchain: 'Ethereum', amount: 1.5 });
      await createBalance(app, { currency: 'USDC', blockchain: 'Ethereum', amount: 2500 });
    });

    it('moves value between two existing balances', async () => {
      const response = await swap({
        from: { currency: 'ETH', blockchain: 'Ethereum', amount: 0.5 },
        to: { currency: 'USDC', blockchain: 'Ethereum', amount: 823.06706795 },
      });

      expect(response.status).toBe(200);
      expect(response.body.data.from).toMatchObject({ currency: 'ETH', amount: 1 });
      expect(response.body.data.to).toMatchObject({ currency: 'USDC', amount: 3323.06706795 });
      expect((await getByCurrency('ETH')).amount).toBe(1);
    });

    it('creates the target balance when the wallet does not hold it yet', async () => {
      const response = await swap({
        from: { currency: 'USDC', blockchain: 'Ethereum', amount: 100 },
        to: { currency: 'GMX', blockchain: 'Arbitrum', amount: 2.75 },
      });

      expect(response.status).toBe(200);
      expect(response.body.data.to).toMatchObject({ currency: 'GMX', blockchain: 'Arbitrum', amount: 2.75 });
      expect((await getByCurrency('GMX')).amount).toBe(2.75);
    });

    it('rounds away floating-point noise', async () => {
      await createBalance(app, { currency: 'ZIL', blockchain: 'Zilliqa', amount: 0.3 });
      const response = await swap({
        from: { currency: 'ZIL', blockchain: 'Zilliqa', amount: 0.1 },
        to: { currency: 'ETH', blockchain: 'Ethereum', amount: 0.1 },
      });

      expect(response.body.data.from.amount).toBe(0.2);
      expect(response.body.data.to.amount).toBe(1.6);
    });

    it('rejects a swap larger than the balance and changes nothing', async () => {
      const response = await swap({
        from: { currency: 'ETH', blockchain: 'Ethereum', amount: 2 },
        to: { currency: 'USDC', blockchain: 'Ethereum', amount: 3000 },
      });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Insufficient ETH balance');
      expect((await getByCurrency('ETH')).amount).toBe(1.5);
      expect((await getByCurrency('USDC')).amount).toBe(2500);
    });

    it('returns 404 when the source balance does not exist', async () => {
      const response = await swap({
        from: { currency: 'WBTC', blockchain: 'Ethereum', amount: 1 },
        to: { currency: 'USDC', blockchain: 'Ethereum', amount: 1 },
      });

      expect(response.status).toBe(404);
    });

    it('rejects swapping a balance with itself, and non-positive amounts', async () => {
      const sameBalance = await swap({
        from: { currency: 'ETH', blockchain: 'Ethereum', amount: 1 },
        to: { currency: 'ETH', blockchain: 'Ethereum', amount: 1 },
      });
      const zeroAmount = await swap({
        from: { currency: 'ETH', blockchain: 'Ethereum', amount: 0 },
        to: { currency: 'USDC', blockchain: 'Ethereum', amount: 1 },
      });

      expect(sameBalance.status).toBe(400);
      expect(zeroAmount.status).toBe(400);
    });
  });

  it('returns 404 JSON for unknown routes', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Route GET /api/unknown not found');
  });
});

describe('database transactions', () => {
  it('rolls back every write when the work throws', async () => {
    const database = await openDatabase(IN_MEMORY);
    const repository = createBalanceRepository(database);

    expect(() =>
      database.transaction(() => {
        repository.create({ currency: 'ETH', blockchain: 'Ethereum', amount: 1 });
        throw new Error('Failed part-way');
      }),
    ).toThrow('Failed part-way');

    expect(repository.findByCurrency('Ethereum', 'ETH')).toBeNull();
  });
});

describe('persistence', () => {
  it('keeps balances in the database file across restarts', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'wallet-api-'));
    const databasePath = path.join(directory, 'wallet.db');

    try {
      const firstRun = createApp(createBalanceRepository(await openDatabase(databasePath)));
      const created = await createBalance(firstRun, { currency: 'ETH', blockchain: 'Ethereum', amount: 1.5 });

      const secondRun = createApp(createBalanceRepository(await openDatabase(databasePath)));
      const response = await request(secondRun).get(`/api/balances/${created.body.data.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.amount).toBe(1.5);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
