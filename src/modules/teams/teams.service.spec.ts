import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('TeamsService', () => {
  let service: TeamsService;
  let repository: MockRepository<Team>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: createMockRepository<Team>(),
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    repository = module.get(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const dto = { name: 'Engineering', description: 'Eng team' };
      const team = {
        id: 'uuid-1',
        name: 'Engineering',
        description: 'Eng team',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
      };

      repository.findOne!.mockResolvedValue(null);
      repository.create!.mockReturnValue(team);
      repository.save!.mockResolvedValue(team);

      const result = await service.create(dto);

      expect(result.id).toBe('uuid-1');
      expect(result.name).toBe('Engineering');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if team name already exists', async () => {
      const dto = { name: 'Engineering' };
      repository.findOne!.mockResolvedValue({
        id: 'existing',
        name: 'Engineering',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of team response DTOs', async () => {
      const teams = [
        {
          id: 'uuid-1',
          name: 'Alpha',
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          users: [],
        },
      ];
      repository.find!.mockResolvedValue(teams);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alpha');
    });
  });

  describe('findOne', () => {
    it('should return a team response DTO', async () => {
      const team = {
        id: 'uuid-1',
        name: 'Alpha',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
      };
      repository.findOne!.mockResolvedValue(team);

      const result = await service.findOne('uuid-1');

      expect(result.id).toBe('uuid-1');
    });

    it('should throw NotFoundException if team not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the team', async () => {
      const existing = {
        id: 'uuid-1',
        name: 'Alpha',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
      };
      const updated = { ...existing, name: 'Beta' };

      repository.findOne!.mockResolvedValueOnce(existing);
      repository.findOne!.mockResolvedValueOnce(null);
      repository.save!.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { name: 'Beta' });

      expect(result.name).toBe('Beta');
    });

    it('should throw NotFoundException if team not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { name: 'Beta' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if updated name already exists', async () => {
      const existing = {
        id: 'uuid-1',
        name: 'Alpha',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
      };

      repository.findOne!.mockResolvedValueOnce(existing);
      repository.findOne!.mockResolvedValueOnce({ id: 'uuid-2', name: 'Beta' });

      await expect(service.update('uuid-1', { name: 'Beta' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the team', async () => {
      const team = { id: 'uuid-1', name: 'Alpha' };
      repository.findOne!.mockResolvedValue(team);
      repository.remove!.mockResolvedValue(team);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(team);
    });

    it('should throw NotFoundException if team not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
