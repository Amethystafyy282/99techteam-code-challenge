import fs from 'node:fs';
import path from 'node:path';
import initSqlJs, { type BindParams, type Database } from 'sql.js';

export const IN_MEMORY = ':memory:';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS balances (
    id TEXT PRIMARY KEY,
    currency TEXT NOT NULL,
    blockchain TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (blockchain, currency)
  );
`;

export interface AppDatabase {
  all: <TRow>(sql: string, params?: BindParams) => TRow[];
  run: (sql: string, params?: BindParams) => number;
  transaction: <TResult>(work: () => TResult) => TResult;
}

export const openDatabase = async (filePath: string): Promise<AppDatabase> => {
  const SQL = await initSqlJs();
  const isInMemory = filePath === IN_MEMORY;
  const database: Database =
    !isInMemory && fs.existsSync(filePath) ? new SQL.Database(fs.readFileSync(filePath)) : new SQL.Database();

  const persist = () => {
    if (isInMemory) {
      return;
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, database.export());
    fs.renameSync(tempPath, filePath);
  };

  database.run(SCHEMA);
  persist();

  let isInTransaction = false;

  return {
    all: <TRow>(sql: string, params: BindParams = []) => {
      const statement = database.prepare(sql, params);
      const rows: TRow[] = [];

      while (statement.step()) {
        rows.push(statement.getAsObject() as TRow);
      }

      statement.free();
      return rows;
    },
    run: (sql: string, params: BindParams = []) => {
      database.run(sql, params);
      const changedRows = database.getRowsModified();

      if (!isInTransaction) {
        persist();
      }

      return changedRows;
    },
    transaction: <TResult>(work: () => TResult): TResult => {
      database.run('BEGIN');
      isInTransaction = true;

      try {
        const result = work();
        database.run('COMMIT');
        isInTransaction = false;
        persist();
        return result;
      } catch (error) {
        database.run('ROLLBACK');
        isInTransaction = false;
        throw error;
      }
    },
  };
};
