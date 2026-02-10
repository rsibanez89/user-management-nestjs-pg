# Simple user management system

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