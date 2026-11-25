# How to run EXO2

The project has two parts. Run each one in its own terminal.

| Part | Path | Package manager | Port |
|------|------|-----------------|------|
| Backend (NestJS, GraphQL) | `EXO2/backend` | **yarn** | 3100 (admin 4001) |
| Frontend (Next.js) | `EXO2/frontend/app` | **yarn** | 3000 |

Always start the backend first, then the frontend.

## Prerequisites

- Node.js v22 or higher
- Yarn (`npm install -g yarn`)

No database is needed. Postgres is not used by the `catalyst-cerebrum` app.

---

## 1. Backend

### One-time setup

Terminal 1, path: `EXO2/backend`

```bash
cd EXO2/backend
yarn install:core
```

`yarn install:core` generates the tsconfig and nest-cli files and runs `yarn install`.

Create the env file for the app (path: `EXO2/backend/src/apps/catalyst-cerebrum`):

```bash
# macOS / Linux
cp src/apps/catalyst-cerebrum/.env.example src/apps/catalyst-cerebrum/.env

# Windows PowerShell
Copy-Item src/apps/catalyst-cerebrum/.env.example src/apps/catalyst-cerebrum/.env
```

This sets `PORT=3100` and `ADMIN_PORT=4001`. Without the `.env` file the backend falls back to port 3000, which clashes with the frontend.

### Start

Path: `EXO2/backend`

```bash
yarn start catalyst-cerebrum
```

It runs in watch mode, so it restarts when you change code. Wait for this log line:

```
[catalyst-cerebrum] App URL: http://[::1]:3100
```

### Backend URLs

| What | URL |
|------|-----|
| GraphQL Playground | http://localhost:3100/graphql |
| Swagger (OpenAPI) | http://localhost:3100/swagger |
| Admin GraphQL | http://localhost:4001/graphql |

There is no page at `http://localhost:3100/`. A `Cannot GET /` 404 there is normal.

### Check that it is running

```bash
curl -X POST http://localhost:3100/graphql -H "Content-Type: application/json" -d "{\"query\":\"{ health { status } }\"}"
```

Expected: `{"data":{"health":{"status":"UP"}}}`

### Other backend commands

Run from `EXO2/backend`:

| Command | What it does |
|---------|--------------|
| `yarn install:core` | Setup after cloning or when core changes |
| `yarn start <app-id>` | Start an app in watch mode |
| `yarn build` | Build the project |
| `yarn start:prod` | Run the built `dist/main` |
| `yarn test` | Run the tests |
| `yarn lint` | Lint and auto-fix |

---

## 2. Frontend

Terminal 2, path: `EXO2/frontend/app`

### One-time setup

```bash
cd EXO2/frontend
yarn install
```

Optional: create `.env.local` in `EXO2/frontend` only if the backend is not at `http://localhost:3100/graphql`.

```bash
cp .env.example .env.local
```

### Start

Path: `EXO2/frontend/app`

```bash
cd EXO2/frontend/app
yarn run dev
```

Open **http://localhost:3000**.

### What you will see

The home page has a status box. It checks the backend every 5 seconds.

- Green box, "Backend is running": the backend answered the `health` query with `UP`.
- Red box, "Backend is not running": the backend can't be reached. The box shows the error and the start command.

### Other frontend commands

Run from `EXO2/frontend/app`:

| Command | What it does |
|---------|--------------|
| `yarn run dev` | Dev server on port 3000 |
| `yarn run build` | Production build |
| `yarn run start` | Serve the production build on port 3000 |

---

## Troubleshooting

| Problem | Cause and fix |
|---------|---------------|
| `{"message":"Cannot GET /","statusCode":404}` | You opened the backend, not the frontend. The frontend is at `http://localhost:3000`. The backend has no `/` page. |
| Backend log shows `App URL: ...:3000` | The `.env` file is missing. Copy `.env.example` to `.env` as shown above, then restart the backend. |
| Frontend shows "Backend is not running" | Start the backend and wait for the `App URL ...:3100` log line. The page refreshes by itself. |
| Frontend terminal shows `POST /graphql 404` | Next.js on port 3000 is receiving the request, so the page is calling its own port instead of the backend. Make sure `NEXT_PUBLIC_GRAPHQL_URL` is `http://localhost:3100/graphql` (or unset) in `EXO2/frontend/.env.local`, then restart `yarn run dev`. |
| Port already in use | Stop the other process, or change `PORT` in the backend `.env` and `NEXT_PUBLIC_GRAPHQL_URL` in the frontend `.env.local`. |
| `yarn: command not found` | Run `npm install -g yarn`. |
