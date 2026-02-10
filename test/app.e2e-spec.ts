import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { TeamsModule } from '../src/modules/teams/teams.module';
import { UsersModule } from '../src/modules/users/users.module';
import { Team } from '../src/modules/teams/entities/team.entity';
import { User } from '../src/modules/users/entities/user.entity';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

interface TeamBody {
  id: string;
  name: string;
  description: string | null;
}

interface UserBody {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  teamId: string | null;
}

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Team, User],
          synchronize: true,
        }),
        TeamsModule,
        UsersModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/teams', () => {
    let teamId: string;

    it('POST /teams - should create a team', () => {
      return request(app.getHttpServer())
        .post('/teams')
        .send({ name: 'Engineering', description: 'The engineering team' })
        .expect(201)
        .expect((res) => {
          const body = res.body as TeamBody;
          expect(body.id).toBeDefined();
          expect(body.name).toBe('Engineering');
          expect(body.description).toBe('The engineering team');
          teamId = body.id;
        });
    });

    it('POST /teams - should reject duplicate team name', () => {
      return request(app.getHttpServer())
        .post('/teams')
        .send({ name: 'Engineering' })
        .expect(409);
    });

    it('POST /teams - should reject invalid body', () => {
      return request(app.getHttpServer())
        .post('/teams')
        .send({ invalidField: 'test' })
        .expect(400);
    });

    it('GET /teams - should return all teams', () => {
      return request(app.getHttpServer())
        .get('/teams')
        .expect(200)
        .expect((res) => {
          const body = res.body as TeamBody[];
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('GET /teams/:id - should return a team', async () => {
      return request(app.getHttpServer())
        .get(`/teams/${teamId}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as TeamBody;
          expect(body.id).toBe(teamId);
          expect(body.name).toBe('Engineering');
        });
    });

    it('GET /teams/:id - should return 404 for unknown id', () => {
      return request(app.getHttpServer())
        .get('/teams/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('GET /teams/:id - should return 400 for invalid UUID', () => {
      return request(app.getHttpServer()).get('/teams/not-a-uuid').expect(400);
    });

    it('PATCH /teams/:id - should update a team', async () => {
      return request(app.getHttpServer())
        .patch(`/teams/${teamId}`)
        .send({ name: 'Platform Engineering' })
        .expect(200)
        .expect((res) => {
          const body = res.body as TeamBody;
          expect(body.name).toBe('Platform Engineering');
        });
    });

    it('DELETE /teams/:id - should remove a team', async () => {
      // Create a team to delete
      const createRes = await request(app.getHttpServer())
        .post('/teams')
        .send({ name: 'Temp Team' });
      const createdTeam = createRes.body as TeamBody;

      return request(app.getHttpServer())
        .delete(`/teams/${createdTeam.id}`)
        .expect(204);
    });

    it('DELETE /teams/:id - should return 404 for unknown id', () => {
      return request(app.getHttpServer())
        .delete('/teams/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/users', () => {
    let userId: string;

    it('POST /users - should create a user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        })
        .expect(201)
        .expect((res) => {
          const body = res.body as UserBody;
          expect(body.id).toBeDefined();
          expect(body.firstName).toBe('John');
          expect(body.lastName).toBe('Doe');
          expect(body.email).toBe('john.doe@example.com');
          userId = body.id;
        });
    });

    it('POST /users - should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        })
        .expect(409);
    });

    it('POST /users - should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'not-an-email',
        })
        .expect(400);
    });

    it('POST /users - should reject missing required fields', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'test@example.com' })
        .expect(400);
    });

    it('GET /users - should return all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          const body = res.body as UserBody[];
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('GET /users/:id - should return a user', async () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as UserBody;
          expect(body.id).toBe(userId);
          expect(body.email).toBe('john.doe@example.com');
        });
    });

    it('GET /users/:id - should return 404 for unknown id', () => {
      return request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('PATCH /users/:id - should update a user', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ firstName: 'Jane' })
        .expect(200)
        .expect((res) => {
          const body = res.body as UserBody;
          expect(body.firstName).toBe('Jane');
        });
    });

    it('DELETE /users/:id - should remove a user', async () => {
      const createRes = await request(app.getHttpServer()).post('/users').send({
        firstName: 'Temp',
        lastName: 'User',
        email: 'temp@example.com',
      });
      const createdUser = createRes.body as UserBody;

      return request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`)
        .expect(204);
    });

    it('DELETE /users/:id - should return 404 for unknown id', () => {
      return request(app.getHttpServer())
        .delete('/users/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
