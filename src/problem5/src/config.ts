import { fileURLToPath } from 'node:url';

export const PORT = Number(process.env.PORT ?? 3000);

export const DATABASE_PATH = process.env.DATABASE_PATH ?? fileURLToPath(new URL('../data/wallet.db', import.meta.url));
