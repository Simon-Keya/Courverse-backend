# Courverse Backend

NestJS + TypeORM + PostgreSQL API for the Courverse learning platform.

## Stack

- NestJS 10, TypeORM, PostgreSQL
- JWT auth (Passport), role-based guards (`learner` | `publisher` | `admin`)
- Swagger at `/api`
- Global prefix: `/api/v1`

## Setup

```bash
cp .env.example .env
# Set DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET

npm install
npm run start:dev
```

Seed demo data:

```bash
npm run seed
```

Demo accounts (password: `password123`):

| Email | Role |
|-------|------|
| learner@courverse.com | learner |
| publisher@courverse.com | publisher |
| admin@courverse.com | admin |

## Main endpoints

- `POST /auth/login`, `POST /auth/signup`, `GET /auth/profile`
- `GET /courses` (filters, pagination), `GET /courses/:id`
- `POST /courses` (publisher), `POST /courses/:id/submit|approve|reject|publish`
- `GET /courses/publisher/mine`, `GET /courses/admin/pending`
- `POST /courses/:courseId/sections`, `POST /sections/:id/lessons`
- `POST /enrollments`, `GET /enrollments/me`
- `POST /progress/lessons/:id/complete` (XP + certificate at 100%)
- `GET /certificates/me`
- `GET /categories`
- `GET|POST|DELETE /wishlist/:courseId`
- `GET /notifications`, `POST /notifications/read-all`

## Architecture

Controllers → Services → TypeORM repositories.  
Business rules (enrollment uniqueness, idempotent progress, certificate issue) live in services with transactions where needed.
