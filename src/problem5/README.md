# Problem 5: Wallet Balance API

A CRUD backend for wallet balances, built with **Express 5** and **TypeScript**. Each balance is one token on one
blockchain, with the same `{ currency, blockchain, amount }` shape the frontend's Wallet panel uses. Data is stored
in a **SQLite** database file, so it survives restarts.

The frontend (Problems 2 and 3) uses this API for its wallet: it lists balances on load and swaps through
`POST /api/balances/swap`. In development, Vite proxies `/api` to this server, so it needs no CORS setup.

## Getting started

Requires Node.js 24+. From the repository root (this folder is an npm workspace, installed with the app):

```bash
npm install
cd src/problem5
npm run seed   # optional: load the same starting wallet as the frontend
npm run dev    # start with auto-reload at http://localhost:3000
```

| Command | Does |
| --- | --- |
| `npm run dev` | Run from source with auto-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server (`npm run build` first) |
| `npm run seed` | Add the starting balances; skips any that already exist, so it's safe to run twice |
| `npm test` | Run the integration tests (Vitest + Supertest, in-memory database) |
| `npm run typecheck` | Type-check source and tests |

### Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `3000` | Port to listen on |
| `DATABASE_PATH` | `src/problem5/data/wallet.db` | SQLite file. Use `:memory:` to keep data in memory only |

## The resource

```json
{
  "id": "8a46fc99-8ec1-4b10-a4f1-9cd663e0387d",
  "currency": "ETH",
  "blockchain": "Ethereum",
  "amount": 1.5,
  "createdAt": "2026-10-20T15:35:36.148Z",
  "updatedAt": "2026-10-20T15:35:36.148Z"
}
```

| Field | Rules |
| --- | --- |
| `currency` | 1–20 letters or digits. Case-sensitive, so `bNEO` and `wstETH` are kept as given |
| `blockchain` | One of `Osmosis`, `Ethereum`, `Arbitrum`, `Zilliqa`, `Neo` |
| `amount` | A number, 0 or more |
| `id`, `createdAt`, `updatedAt` | Set by the server |

A wallet holds one balance per token per chain, so the **`blockchain` + `currency` pair is unique**. The same token can
still exist on different chains, e.g. USDC on Ethereum and on Arbitrum.

## Endpoints

All responses are JSON. Successful responses wrap the result in `data`.

| Method | Path | Does | Success |
| --- | --- | --- | --- |
| `GET` | `/health` | Health check | `200` |
| `POST` | `/api/balances` | Create a balance | `201` + `Location` header |
| `GET` | `/api/balances` | List balances, with filters | `200` |
| `GET` | `/api/balances/:id` | Get one balance | `200` |
| `PATCH` | `/api/balances/:id` | Update some fields | `200` |
| `DELETE` | `/api/balances/:id` | Delete a balance | `204` |
| `POST` | `/api/balances/swap` | Move value between two balances, atomically | `200` |

### List filters

All optional, combined with AND:

| Query | Example | Meaning |
| --- | --- | --- |
| `currency` | `?currency=ETH` | Exact token symbol |
| `blockchain` | `?blockchain=Osmosis` | Exact chain |
| `minAmount`, `maxAmount` | `?minAmount=1&maxAmount=100` | Inclusive amount range |
| `sortBy` | `?sortBy=amount` | `amount`, `currency`, `blockchain`, `createdAt` (default) or `updatedAt` |
| `order` | `?order=desc` | `asc` (default) or `desc` |
| `limit` | `?limit=10` | Page size, 1–100 (default 20) |
| `offset` | `?offset=20` | Rows to skip (default 0) |

The response includes the total number of matches, so clients can page through results:

```json
{ "data": [ … ], "meta": { "total": 2, "limit": 20, "offset": 0 } }
```

### Swapping between balances

The frontend's swap form uses this endpoint. It takes value out of one balance and adds value to another:

```json
{
  "from": { "currency": "ETH", "blockchain": "Ethereum", "amount": 0.5 },
  "to": { "currency": "USDC", "blockchain": "Ethereum", "amount": 823.06706795 }
}
```

Both changes happen in **one database transaction**: they're saved together, or, if anything fails, neither is. Doing
the same with two `PATCH` requests could leave the first change applied when the second fails, losing value. The `to`
balance is created if the wallet doesn't hold that token yet. New amounts are rounded to 8 decimals to clear
floating-point noise.

The response contains the two balances after the swap:

```json
{ "data": { "from": { "currency": "ETH", "amount": 1, … }, "to": { "currency": "USDC", "amount": 3323.06706795, … } } }
```

Both amounts are supplied by the client, already converted at its prices; the API has no price feed of its own, so it
doesn't check the exchange rate. A production exchange would price the swap on the server.

### Errors

Every error has the same shape. Validation errors list every problem at once, not just the first:

```json
{
  "error": {
    "message": "Invalid request",
    "details": [
      { "path": "blockchain", "message": "Invalid option: expected one of \"Osmosis\"|\"Ethereum\"|…" },
      { "path": "amount", "message": "Invalid input: expected number, received string" }
    ]
  }
}
```

| Status | When |
| --- | --- |
| `400` | Invalid body, query or id (not a UUID), unknown fields, or malformed JSON |
| `404` | No balance with that id, a swap's `from` balance doesn't exist, or an unknown route |
| `409` | The `blockchain` + `currency` pair already exists (on create, or when an update would duplicate it) |
| `422` | A swap's `from` balance doesn't cover the amount (`Insufficient ETH balance`) |
| `500` | Unexpected server error (logged, details hidden from the client) |

### Examples

```bash
# Create
curl -X POST http://localhost:3000/api/balances \
  -H 'Content-Type: application/json' \
  -d '{"currency":"WBTC","blockchain":"Ethereum","amount":0.25}'

# List Ethereum balances, largest first
curl 'http://localhost:3000/api/balances?blockchain=Ethereum&sortBy=amount&order=desc'

# Get, update and delete one (replace :id)
curl http://localhost:3000/api/balances/:id
curl -X PATCH http://localhost:3000/api/balances/:id -H 'Content-Type: application/json' -d '{"amount":0.75}'
curl -X DELETE http://localhost:3000/api/balances/:id
```

## How it's built

```
src/
├── index.ts                    # Opens the database and starts the server
├── app.ts                      # Builds the Express app (routes + middleware)
├── config.ts                   # PORT and DATABASE_PATH
├── errors.ts                   # HttpError subclasses and parseOrThrow
├── db/
│   ├── database.ts             # SQLite connection, schema and persistence
│   └── seed.ts                 # Starting data
├── balances/
│   ├── balance.schema.ts       # Zod schemas: request bodies, query, id
│   ├── balance.repository.ts   # All SQL for balances
│   └── balance.routes.ts       # HTTP handlers
└── middleware/
    └── errorHandler.ts         # 404 and error → JSON
tests/
└── balances.test.ts            # Integration tests for every endpoint
```

A request flows **route → validate → repository → database**:

1. **Validation** (`zod`): every body, query string and id is checked before it's used. Unknown fields are rejected,
   so a typo like `amout` is a 400 instead of being silently ignored. Query values are converted from text to numbers.
2. **Repository**: the only place with SQL. Every value is passed as a bound parameter, never pasted into the query.
   Sort columns come from a fixed whitelist, so user input can't inject SQL.
3. **Errors**: handlers throw `NotFoundError`, `ConflictError` or `ValidationError`, and one error middleware turns
   them into JSON responses. Express 5 forwards thrown errors automatically.

### Why SQLite via sql.js

[sql.js](https://sql.js.org) is SQLite compiled to WebAssembly. It's a real SQL database with constraints (`UNIQUE`,
`CHECK`), but it needs no native compilation, so it installs anywhere with no build tools. It runs the database in
memory and writes the file back after every change, using a temp file and a rename so a crash can't leave a corrupt
file. That suits a small service like this. For heavy concurrent writes you'd move to a database server such as
PostgreSQL; only `database.ts` and the repository would need to change.

`createApp` receives the repository as a parameter, so the tests run the real app against a fresh in-memory database
for each test, plus one test that restarts against a database file to check that data persists.
