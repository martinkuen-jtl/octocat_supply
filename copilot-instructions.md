# Copilot instructions — OctoCAT Supply

## Project summary
OctoCAT Supply is a demo full‑stack TypeScript supply‑chain app (React + Express) backed by SQLite. It is designed as a Copilot showcase and follows an ERD-driven domain model (Headquarters, Branches, Orders, OrderDetails, Deliveries, Suppliers, Products).

## Tech stack & structure
- Frontend: React 18+, TypeScript, Vite, Tailwind CSS (in `frontend/`)
- Backend: Express.js, TypeScript, SQLite, OpenAPI/Swagger (in `api/`)
- Docs: Architecture + SQLite guides in `docs/`
- Dev tooling: Makefile at repo root; Docker Compose at repo root; optional devcontainer in `.devcontainer/`

## How to run (preferred)
- Install deps: `make install`
- Dev (API + frontend): `make dev`
  - API: http://localhost:3000
  - Frontend: http://localhost:5173
- Tests: `make test`
- Build: `make build`
- Database init/seed: `make db-init` / `make db-seed`

## Database conventions
- Default SQLite file: `api/data/app.db` (override with `DB_FILE=/abs/path/app.db`)
- Tests use an in-memory SQLite DB (`:memory:`)
- Keep foreign keys enabled and prefer parameterized queries.
- Migrations live in `api/sql/migrations` and are executed in order; seed data lives in `api/sql/seed`.

## Commit message style
Use a short **title + description** format.

**Format**
- Title (subject): imperative mood, ~50 chars max, no trailing period
- Blank line
- Description (body): 1–3 sentences describing what changed + why (optional impact/risk)

**Example**

Add supplier search endpoint

Expose /suppliers/search to filter suppliers by name and reduce client-side filtering.
Includes validation and updates the OpenAPI spec.

## Coding conventions (what Copilot should follow)
### TypeScript
- Prefer explicit types at module boundaries (API handlers, repository methods, exported functions).
- Use async/await consistently; avoid mixing callbacks and promises.
- Keep functions small and single-purpose.

### Backend (Express + SQLite)
- Keep REST routes thin: validation + calling a repository/service.
- Put persistence logic in repositories; keep mapping between camelCase models and snake_case columns inside the repository layer.
- Use consistent error types (e.g., NotFound/Validation/Conflict) and let centralized Express error middleware translate them to HTTP responses.
- When adding/adjusting endpoints, update/generate the OpenAPI/Swagger spec (see Makefile `swagger` target / api scripts).

### Frontend (React)
- Prefer functional components with hooks.
- Keep data fetching in a small API client module; don’t scatter fetch calls across UI components.
- Tailwind: favor composable utility classes; avoid large bespoke CSS.

## When making changes
- If you touch data model or relationships: update ERD-related docs and add migrations + seed updates.
- Add/adjust tests alongside changes (`api` and/or `frontend`).
- Keep Docker and Make targets working; if you add new required env vars, document them in README/docs.

## Output expectations for Copilot
- Provide complete file diffs (not partial snippets) when generating new files.
- Prefer edits that keep the project runnable via `make dev` and testable via `make test`.