# 99Tech Code Challenge #1 #

My solutions to the 99Tech code challenge. Problems 2, 3 and 5 run together: a currency swap form and a wallet,
backed by a wallet balance API.

| Problem | Solution | Where |
| --- | --- | --- |
| 1. Three ways to sum to n | Iterative, closed-form (Gauss) and divide-and-conquer versions | `src/problem1/sum_to_n.js` |
| 2. Fancy form | Currency swap form with live rates, validation and USD values | `src/problem2/` |
| 3. Messy React | Annotated original (`messy.tsx`), refactor (`cleaned.tsx`), and the refactor running as the Wallet panel | `src/problem3/` |
| 5. A crude server | Express + TypeScript CRUD API for wallet balances, stored in SQLite ([API docs](src/problem5/README.md)) | `src/problem5/` |

## Quick start

Requires Node.js 24+ (npm comes with it).

```bash
npm install
npm run api:seed   # first run only: create the wallet database
npm run dev:all    # start the API (port 3000) and the app (http://localhost:5173)
```

Problem 1 runs on its own: `node src/problem1/sum_to_n.js`.

## How it fits together

- The app fetches token prices from Switcheo's price feed and balances from the API. Vite proxies `/api` to port 3000.
- Swaps go through `POST /api/balances/swap`, which updates both balances in one database transaction.
- Balances persist in `src/problem5/data/wallet.db`.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4 · Express 5, Zod, SQLite (sql.js) · Vitest, ESLint, Prettier

## Use of AI

I used an AI coding assistant (Claude Code) to speed up the work: scaffolding, repetitive refactors, writing tests
and checking edge cases. I made the design decisions, reviewed every change, and kept the code to the conventions
enforced by the ESLint and Prettier setup.
