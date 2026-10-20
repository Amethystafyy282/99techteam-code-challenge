import { createApp } from './app.js';
import { createBalanceRepository } from './balances/balance.repository.js';
import { DATABASE_PATH, PORT } from './config.js';
import { openDatabase } from './db/database.js';

const database = await openDatabase(DATABASE_PATH);
const app = createApp(createBalanceRepository(database));

app.listen(PORT, () => {
  console.log(`Wallet balance API listening on http://localhost:${PORT}`);
  console.log(`Database: ${DATABASE_PATH}`);
});
