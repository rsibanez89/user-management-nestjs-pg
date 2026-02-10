# Simple NestJs Project Instructions

## Tech Stack

- **Runtime:** NestJS (Node.js)
- **Language:** TypeScript (strict mode)
- **Package Manager:** Yarn
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Testing:** Jest
- **Protocol:** HTTP / REST

---

## Project Structure

- One NestJS module per feature domain.
- Each module owns its controllers, services, and entities.
- Group DTOs in a `dto/` subfolder per module.
- Group entities in an `entities/` subfolder per module.

---

## Code Style

### TypeScript

- Enable `strict` and `noImplicitAny` in `tsconfig.json`.
- Prefer `interface` over `type` for object shapes.
- Use `enum` only for fixed, known value sets.
- Avoid `any`. Use `unknown` and narrow with guards.
- Add concise JSDoc to public methods and classes.

### Controllers

- Keep controllers thin. No business logic.
- One controller per resource (e.g., `TeamsController`).
- Use HTTP decorators: `@Get`, `@Post`, `@Patch`, `@Delete`.
- Return DTOs, never raw entities.
- Apply `@HttpCode` when the default is wrong.
- Use `@Param`, `@Query`, `@Body` for input binding.

### Services

- All business logic lives in services.
- Inject dependencies via constructor injection.
- Return plain objects or DTOs, not entities.
- Throw NestJS HTTP exceptions for error cases.
- Keep methods short and single-purpose.

### DTOs

- DTOs define the API contract.
- Validate with `class-validator` decorators.
- Transform with `class-transformer` decorators.
- Create separate DTOs for inputs (Request) and outputs (Response).
- Use distinct Response DTOs (e.g. `UserResponseDto`) effectively acting as View Models.
- Map Entities to Response DTOs in the Service layer (or use a mapper/serializer).
- Use `PartialType` or `PickType` to reduce duplication.

### Entities

- One entity class per database table.
- Keep entity files in `entities/` per module.
- Use TypeORM decorators: `@Entity`, `@Column`, etc.
- Never expose entities directly in API responses.
- Define relations explicitly with `@ManyToOne`, etc.

### Error Handling

- Use NestJS built-in exceptions (e.g., `NotFoundException`).
- Centralize cross-cutting errors in exception filters.
- Return consistent JSON error shapes.
- Never leak stack traces in production.

### Security

- Validate all input with DTOs and pipes.
- Sanitize strings to prevent injection attacks.
- Apply auth guards at the controller or route level.
- Use rate limiting on public endpoints.

---

## Testing

### Unit Tests

- Test services and controllers in isolation.
- Mock all external dependencies.
- Use `jest.fn()` and `jest.spyOn()` for mocking.
- Name test files `*.spec.ts` next to source files.
- Test behavior, not implementation details.

### E2E Tests

- Test critical HTTP flows end-to-end.
- Place E2E tests in `test/` with `*.e2e-spec.ts` names.
- Use a test database, never production data.
- Keep E2E tests fast and deterministic.

### Running Tests

- `yarn test` — run all unit tests.
- `yarn test:e2e` — run all E2E tests.
- All tests must pass before merging.

---

## Build & CI

- `yarn build` must complete with zero errors.
- `yarn lint` must pass with no warnings.
- Run `yarn build`, `yarn test`, `yarn test:e2e` before merging.
- Use semantic commit messages (e.g., `feature/`, `fix/`).
- Enforce lint, type-check, and tests in CI pipelines.

---

## Feature Implementation Checklist

1. Create or update the module, controller, and service.
2. Define request and response DTOs with validation.
3. Add or update entity if persistence changes.
4. Write unit tests for new or changed logic.
5. Write or update E2E tests for HTTP flows.
6. Run `yarn lint` — must pass with no warnings.
7. Run `yarn build` — must succeed with no errors.
8. Run `yarn test` — all unit tests must pass.
9. Run `yarn test:e2e` — all E2E tests must pass.
10. Commit with a semantic message and push.