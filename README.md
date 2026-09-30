# User Management System

A RESTful user management application built with NestJS, TypeORM, and PostgreSQL. The application provides full CRUD operations for **Teams** and **Users**, where users can optionally belong to a team.

## Features

- **Teams CRUD** — Create, read, update, and delete teams
- **Users CRUD** — Create, read, update, and delete users with team assignment
- Input validation via `class-validator`
- Consistent JSON error responses via a global exception filter
- Response DTOs — entities are never exposed directly

## Tech Stack

- **Runtime:** NestJS (Node.js)
- **Language:** TypeScript (strict mode)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Testing:** Jest
- **Package Manager:** Yarn

## Getting Started

```bash
# Start the database
docker compose up -d

# Install dependencies
yarn install

# Run in development mode
yarn start:dev
```

## API Endpoints

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| GET    | /teams         | List all teams    |
| POST   | /teams         | Create a team     |
| GET    | /teams/:id     | Get a team by ID  |
| PATCH  | /teams/:id     | Update a team     |
| DELETE | /teams/:id     | Delete a team     |
| GET    | /users         | List all users    |
| POST   | /users         | Create a user     |
| GET    | /users/:id     | Get a user by ID  |
| PATCH  | /users/:id     | Update a user     |
| DELETE | /users/:id     | Delete a user     |

## Testing

```bash
yarn test        # Unit tests
yarn test:e2e    # E2E tests
```

## Project Structure

```
src/
├── app.module.ts               # Root module
├── main.ts                     # Entry point
├── common/                     # Shared utilities across modules
│   ├── decorators/             # Custom decorators (e.g., @CurrentUser)
│   ├── dto/                    # Shared DTOs (e.g., PaginationQueryDto)
│   ├── filters/                # Global exception filters
│   └── guards/                 # Global guards (e.g., JwtAuthGuard)
├── config/                     # Configuration files (environment vars)
│   └── typeorm.config.ts
├── database/                   # Database migrations and seeds
├── modules/                    # Feature modules (Domain Logic)
│   ├── teams/
│   │   ├── dto/
│   │   │   ├── create-team.dto.ts
│   │   │   └── update-team.dto.ts
│   │   ├── entities/
│   │   │   └── team.entity.ts
│   │   ├── teams.controller.ts
│   │   ├── teams.module.ts
│   │   └── teams.service.ts
│   └── users/
│       ├── dto/
│       │   └── user-response.dto.ts
│       ├── entities/
│       │   └── user.entity.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
```

Get an auth0 token for testing:

```bash
curl --request POST \
  --url https://user-management-nesjs-pg.au.auth0.com/oauth/token \
  --header 'Content-Type: application/json' \
  --data '{
    "client_id": "qoXgDoi8lrN1eOkddL0OzPpaOOzmM3Ay",
    "client_secret": "<YOUR_CLIENT_SECRET>",
    "audience": "https://api.user-management-nesjs-pg",
    "grant_type": "client_credentials"
  }'
```