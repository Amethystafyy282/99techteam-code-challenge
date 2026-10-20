import { createBalanceRepository } from '../balances/balance.repository.js';
import type { CreateBalanceInput } from '../balances/balance.schema.js';
import { DATABASE_PATH } from '../config.js';
import { openDatabase } from './database.js';

const SEED_BALANCES: CreateBalanceInput[] = [
  { currency: 'ETH', blockchain: 'Ethereum', amount: 1.5 },
  { currency: 'USDC', blockchain: 'Ethereum', amount: 2500 },
  { currency: 'OSMO', blockchain: 'Osmosis', amount: 1200 },
  { currency: 'ATOM', blockchain: 'Osmosis', amount: 0 },
  { currency: 'GMX', blockchain: 'Arbitrum', amount: 10 },
  { currency: 'ZIL', blockchain: 'Zilliqa', amount: 50000 },
  { currency: 'bNEO', blockchain: 'Neo', amount: 30 },
];

const repository = createBalanceRepository(await openDatabase(DATABASE_PATH));
let createdCount = 0;

for (const balance of SEED_BALANCES) {
  if (!repository.findByCurrency(balance.blockchain, balance.currency)) {
    repository.create(balance);
    createdCount++;
  }
}

console.log(`Seeded ${createdCount} balance(s) into ${DATABASE_PATH}`);
