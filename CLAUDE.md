# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project goal

A community board-game lending library app (see `README.md` for the full ticket breakdown, `feature/BGLL-01` through `BGLL-08`):

1. React frontend to browse and filter the game collection.
2. "Add Collection" form to add a new game.
3. Ability to transition a game's `status` (lifecycle).
4. Special `retired` status (meaning lost or damaged) — a retired game can no longer be `available`.

Design questions the project owner flagged as still open (worth raising if touching related work):
- No authentication is implemented, but the schema leaves room to add it later (`created_by`/`updated_by` already reference a `user_id`, currently unenforced/nullable).
- `status` and `category` are modeled as MySQL enums — flag if a change to the set of values is requested, since enum modifications aren't free.
- Unclear whether a `retired` game should link to a replacement copy (may need an additional linking table) — not yet decided.

## Repo layout

Two independent apps plus a demo-only root compose file:

- `backend/` — Laravel 13 (PHP 8.3) JSON API. Has its own `CLAUDE.md` (Laravel Boost agent guidelines — package versions, Artisan/Pint/PHPUnit conventions) and a `laravel-best-practices` skill scoped to `backend/`. Read that file when working in `backend/`.
- `frontend/` — React 19 + Vite 8, plain JS (no TypeScript), linted with `oxlint`.
- Root `compose.yaml` just `include`s `backend/compose.yaml` and `frontend/compose.yaml` so the whole stack can be started together for demo purposes; day-to-day development normally runs each side independently (see below).
- Root `.gitignore` is a leftover CakePHP-oriented template and does not apply to `backend/` or `frontend/`, which have their own generated `.gitignore` files.
- `docs/BGLL-*.md` — short per-ticket working notes from the project owner (progress logs, feature requirements as originally specified). Check here for the original intent behind a ticket before re-deriving requirements from code.

The frontend's `src/api/games.js` now calls the real Laravel API directly via `fetch` (base URL defaults to `http://localhost:8080/api`, overridable with `VITE_API_BASE_URL`) — it no longer talks to an in-memory mock. (History: it was built in `BGLL-07` before `BGLL-05`, the Games API, landed, so it started out backed by a mock shaped to match the real REST contract; that mock has since been removed.)

## Common commands

### Backend (`backend/`)

Local dev uses Laravel Sail (Docker Compose + MySQL). From `backend/`:

```bash
./vendor/bin/sail up            # start PHP/MySQL containers (http://localhost:8080)
./vendor/bin/sail artisan test --compact                          # run all tests
./vendor/bin/sail artisan test --compact tests/Feature/GameControllerTest.php   # run one file
./vendor/bin/sail artisan test --compact --filter=testName        # run one test by name
./vendor/bin/sail artisan migrate
vendor/bin/pint --dirty --format agent   # format PHP files touched since last commit
```

If Sail isn't running, `php artisan ...` / `vendor/bin/pint ...` work directly as long as a local PHP 8.3 + MySQL are configured against `backend/.env`.

Test conventions (from `backend/CLAUDE.md`, Laravel Boost): PHPUnit only (no Pest), feature tests over unit tests by default, use model factories rather than manual instantiation, run only the tests relevant to a change before finalizing. Run `vendor/bin/pint --dirty --format agent` after any PHP edit.

### Frontend (`frontend/`)

```bash
npm install
npm run dev        # Vite dev server, http://localhost:5173
npm run build
npm run lint        # oxlint
npm run preview
```

### Full stack (demo)

From the repo root:

```bash
docker compose up --build
```

- `.env` at the repo root is a symlink to `backend/.env`, so plain `docker compose` (which only auto-loads a `.env` from the directory it's run in) still picks up the same DB/app config Sail uses.
- `WWWUSER`/`WWWGROUP` default to `1000` in `backend/compose.yaml` (typical single-user Linux/WSL setup); override (`WWWUSER=$(id -u) WWWGROUP=$(id -g) docker compose up --build`) if the host user isn't UID/GID 1000.
- Frontend: http://localhost:5175, Backend: http://localhost:8080.
- Don't run the root stack and `sail up` at the same time — they'd fight over the same ports (8080, 3306, 5173).

## Backend architecture

Decoupled JSON API (no Inertia, no bundled frontend) — see `backend/routes/api.php`:

```
GET   /api/games              GameController@index        (?status=, ?title= both optional; filters by exact status and/or partial title match; omitting status returns everything, capped at 1000 rows)
POST  /api/games               GameController@store        (title, category → created with status=available)
PATCH /api/games/{game}/status GameController@updateStatus (status → validated against lifecycle rules)
```

- **`App\Models\Game`** (`backend/app/Models/Game.php`) — `category` and `status` are cast to backed enums (`App\Enums\GameCategory`, `App\Enums\GameStatus`), not raw strings. Has `creator()`/`updater()` `BelongsTo` relations to `User` via `created_by`/`updated_by` (nullable, unenforced — no auth yet).
- **`App\Enums\GameStatus`** owns the lifecycle transition rules via `allowedTransitions()` / `canTransitionTo()`: `available → {reserved, retired}`, `reserved → {on_loan, retired}`, `on_loan → {available, retired}`, `retired → {}` (terminal). This is the single source of truth for valid status transitions — don't duplicate the cycle logic elsewhere.
- Validation lives in `FormRequest` classes (`backend/app/Http/Requests/`), not in the controller: `IndexGameRequest` allows an optional `status` enum value and an optional `title` string on list (both nullable — see index route above); `StoreGameRequest` validates `title`/`category`; `UpdateGameStatusRequest` validates the target `status` enum value and then uses an `after()` hook to reject a transition `$game->status` doesn't allow, via `GameStatus::canTransitionTo()`.
- Controllers return `{"data": ...}` envelopes directly from Eloquent models/collections — no API Resource classes yet, despite Boost's general guidance to prefer them; existing convention wins per Boost's own rule ("follow existing application convention" if resources aren't already used).
- `games` table (`backend/database/migrations/..._create_games_table.php`): `status`/`category` are native MySQL `enum` columns, `created_by`/`updated_by` are nullable `unsignedBigInteger` (no FK constraint yet), `updated_at` auto-updates via `useCurrentOnUpdate()`. `status` has a plain index (added in a later migration) since it's the primary list-filter column.

## Frontend architecture

- `src/App.jsx` is the single stateful root: holds `games`/`loading`/`error`/modal-open state plus the table's `statusFilter`/`search` state, and refetches via `listGames({ status, title })` whenever those filters change (debounced for `search`) rather than fetching once and filtering client-side. `onStatusChanged`/`onGameCreated` trigger a refetch (via a `reloadToken` bump) rather than splicing the returned game into local state, so the visible list always reflects the current filter/search against the server.
- `src/api/games.js` is the sole data-access boundary — components never call `fetch` against the backend directly.
- `src/constants/game.js` holds the category/status value lists shared between components and the backend's enum values.
- Components (`src/components/`): `Header` (title + "ADD GAME" button), `GamesTable`/`GamesTableRow` (the filterable table), `StatusControl` (per-row status-change dropdown, disabled when `retired`), `AddGameModal`/`AddGameButton` (creation form).
- Linting is `oxlint`, not ESLint (see `frontend/.oxlintrc.json` — `react` + `oxc` plugins, `rules-of-hooks` as an error).
