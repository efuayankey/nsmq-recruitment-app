# NSMQ MasterQuiz

> Practice platform for Archbishop Porter Girls' Senior High School's NSMQ team selection — timed contest rounds, instant scoring, and progress tracking.

Not affiliated with NSMQ, Primetime Limited, or the Ghana Education Service.

## Features

- Auth for students and admins (JWT)
- Admin-managed question bank across all 5 NSMQ round types — General Questions, Speed Race, Problem of the Day, True/False, and progressive-clue Riddles
- Config-driven quiz session engine: Full Contest Simulation, Round Practice, Subject Practice, Quick Drill
- Server-side scoring with answer normalization and numeric tolerance; server-authoritative per-question timers (Redis)
- Session history, dashboard analytics (accuracy by subject/round, streaks), mistake review, and a leaderboard

## Tech stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** FastAPI + SQLAlchemy + Alembic
- **Database:** PostgreSQL
- **Cache / session timers:** Redis
- **Local dev:** Docker Compose

## Getting started (local dev)

Requires Docker.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up -d
docker compose exec backend python -m scripts.seed   # sample questions + demo admin login
```

- Frontend: http://localhost:3000 (or whatever port you mapped in `docker-compose.yml` if 3000 is taken locally)
- Backend API + docs: http://localhost:8000/docs

Run the backend test suite:

```bash
docker compose exec backend pytest -q
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) — frontend on Vercel, backend + Postgres + Redis on Render (`render.yaml` at the repo root).

## Project structure

```
frontend/   Next.js app
backend/    FastAPI app, Alembic migrations, pytest suite
docker-compose.yml
render.yaml
.github/workflows/ci.yml
```
