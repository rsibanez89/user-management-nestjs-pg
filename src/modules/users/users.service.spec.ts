import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const user = {
        id: 'uuid-1',
        ...dto,
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: null,
      };

      repository.findOne!.mockResolvedValue(null);
      repository.create!.mockReturnValue(user);
      repository.save!.mockResolvedValue(user);

      const result = await service.create(dto);

      expect(result.id).toBe('uuid-1');
      expect(result.email).toBe('john@example.com');
      expect(repository.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      repository.findOne!.mockResolvedValue({
        id: 'existing',
        email: dto.email,
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of user response DTOs', async () => {
      const users = [
        {
          id: 'uuid-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          teamId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          team: null,
        },
      ];
      repository.find!.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
    });
  });

  describe('findOne', () => {
    it('should return a user response DTO', async () => {
      const user = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: null,
      };
      repository.findOne!.mockResolvedValue(user);

      const result = await service.findOne('uuid-1');

      expect(result.id).toBe('uuid-1');
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const existing = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: null,
      };
      const updated = { ...existing, firstName: 'Jane' };

      repository.findOne!.mockResolvedValue(existing);
      repository.save!.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { firstName: 'Jane' });

      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { firstName: 'Jane' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if updated email already exists', async () => {
      const existing = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: null,
      };

      repository.findOne!.mockResolvedValueOnce(existing);
      repository.findOne!.mockResolvedValueOnce({
        id: 'uuid-2',
        email: 'taken@example.com',
      });

      await expect(
        service.update('uuid-1', { email: 'taken@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      const user = { id: 'uuid-1', firstName: 'John' };
      repository.findOne!.mockResolvedValue(user);
      repository.remove!.mockResolvedValue(user);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
