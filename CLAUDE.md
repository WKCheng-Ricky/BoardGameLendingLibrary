# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

The Laravel backend has been scaffolded in `backend/` (API-only, no bundled frontend starter kit — React is planned as a separate repository per `BGLL-06`). It uses Laravel Sail for local Docker Compose (`backend/compose.yaml`), with MySQL as the database. React frontend code does not exist yet.

Note: the root `.gitignore` is a leftover CakePHP-oriented template (`/vendor`, `/tmp/cache/...`, CakePHP 2/3 paths) predating the Laravel decision; it does not apply to `backend/`, which has its own Laravel-generated `.gitignore`.

## Project goal

A community board-game lending library app. Planned features (see `README.md` for the full ticket breakdown under `feature/BGLL-01` through `BGLL-07`):

1. React frontend to browse and filter the game collection.
2. "Add Collection" form to add a new game.
3. Ability to transition a game's `lifeCycle` (status).
4. Special `retired` status (meaning lost or damaged) — a retired game can no longer be `available`.

## Planned architecture

- **Backend**: Laravel (in `backend/`), decoupled JSON API — no Inertia/bundled frontend. MySQL 8.4 (Laravel Sail's default for PHP 8 at scaffold time; the original plan said 8.0, but the project owner chose to keep Sail's default rather than pin down), run via Docker Compose (`backend/compose.yaml`, via `./vendor/bin/sail`).
- **Frontend**: React, separate base repository, calling the Laravel API over REST/CORS (decoupled, not Inertia).
- **Schema management**: possibly Flyway for migrations (flagged in README as possibly unnecessary/one-off).

### Core entity: `Game`

```
Game
  id: long
  title: varchar(255)
  category: enum (strategy, family, party, kids)
  status: enum (available, reserved, on_loan, retired)
  created_by: long (user_id)
  created_on: datetime
  updated_by: long (user_id)
  updated_on: datetime (auto-update on MySQL)
```

Open design questions noted by the project owner (worth raising if touching related work):
- No authentication is planned yet, but the schema/design should leave room to add it later (`created_by`/`updated_by` already reference a `user_id`).
- `status` is modeled as a MySQL enum — flag if a change to the set of statuses is requested, since enum modifications aren't free.
- Unclear whether a `retired` game should link to a replacement copy (may need an additional linking table) — not yet decided.
