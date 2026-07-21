# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains **no application code** — only planning notes in `README.md`. There is no build, lint, or test tooling set up yet, and no package manifests exist. Before assuming any command works, check whether the corresponding scaffolding (Laravel app, React app, Docker Compose files) has actually been created.

Note: `.gitignore` is a CakePHP-oriented template (`/vendor`, `/tmp/cache/...`, CakePHP 2/3 paths), but the plan in `README.md` is to build the backend in **Laravel**. Treat this as a leftover placeholder, not a signal that CakePHP is in use — confirm with the user before relying on either assumption.

## Project goal

A community board-game lending library app. Planned features (see `README.md` for the full ticket breakdown under `feature/BGLL-01` through `BGLL-07`):

1. React frontend to browse and filter the game collection.
2. "Add Collection" form to add a new game.
3. Ability to transition a game's `lifeCycle` (status).
4. Special `retired` status (meaning lost or damaged) — a retired game can no longer be `available`.

## Planned architecture

- **Backend**: Laravel + MySQL 8.0, run via Docker Compose.
- **Frontend**: React, separate base repository.
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
