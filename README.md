Arthur: W Cheng\
Development Environment: WSL - Ubuntu 24.04.4 LTS\
AI Assistant: Claude Code\
Tools: VsCode\
Setup Developlment Environment: Completed at 2026-07-21 15:04 BST\
GitHub token works.\

## Note

This README is the inital draft on how to progress on this task, will be trasnfer to `docs/inital thought` later in the repository.

## Inital Thought

Task: Develop a community board-game lending library.

Feature 1:  Create frontend page in `React`, allow browsing and filter the collection.

Feature 2: Create a button as `Add Collection`, create a form for adding a collection.

Feature 3: Allow transition of collection's `lifeCycle`

Feature 4: Special case of `lifeCycle`, `retired` (Retired mean **lost** or **damaged**). (When `Game` is retired, status no longer can be `available`.)

### Database Spec

```mermaid
erDiagram
    Game{
        long id
        varchar(255) title
        enum category "strategy, family, party, kids"
        enum status "available, reserved, on_loan, retired"
        long created_by "user_id"
        datetime created_on
        long updated_by "user_id"
        datetime updated_on "auto update on MySQL"
    }
```


## Initial Caution thought

1. Probably no login for now? There is no requirement for authencation yet, tho should left room for adding such function later.
2. Database using enum... is efficient, but will there be modification on `status` enum?
3. For feature 4, What does it mean a replacement copy can be linked to retired one ?? So that there is an additional table linking retired `Game`????

## Feature distribution

|progress|ticket|description|
|-|-|-|
|In-Progress|`feature/BGLL-01`|Create Laravel Base repository. Create Docker-compose base for Laravel and Mysql 8.4 (Laravel Sail default for PHP 8, decoupled API app in `backend/`)|
||`feature/BGLL-02`|Create Schema for `Games` in MySQL|
||`feature/BGLL-03`|Use Flyway to maintain database updates ... probably doesnt need? One-off task|
||`feature/BGLL-04`|Create ORM model in Laravel|
||`feature/BGLL-05`|Create API for CRUD of `Games` record|
||`feature/BGLL-06`|Create React base repository|
||`feature/BGLL-07`|Create Frontend Page|



