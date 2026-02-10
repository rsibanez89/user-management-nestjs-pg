import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller.js';
import { TeamsService } from './teams.service.js';
import { TeamResponseDto } from './dto/team-response.dto.js';

const mockTeamsService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: ReturnType<typeof mockTeamsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [{ provide: TeamsService, useFactory: mockTeamsService }],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to service and return result', async () => {
      const dto = { name: 'Engineering' };
      const response: TeamResponseDto = {
        id: 'uuid-1',
        name: 'Engineering',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const response: TeamResponseDto[] = [];
      service.findAll.mockResolvedValue(response);

      expect(await controller.findAll()).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should return a single team', async () => {
      const response: TeamResponseDto = {
        id: 'uuid-1',
        name: 'Alpha',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.findOne.mockResolvedValue(response);

      expect(await controller.findOne('uuid-1')).toEqual(response);
    });
  });

  describe('update', () => {
    it('should delegate to service', async () => {
      const dto = { name: 'Beta' };
      const response: TeamResponseDto = {
        id: 'uuid-1',
        name: 'Beta',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.update.mockResolvedValue(response);

      expect(await controller.update('uuid-1', dto)).toEqual(response);
    });
  });

  describe('remove', () => {
    it('should delegate to service', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('uuid-1');

      expect(service.remove).toHaveBeenCalledWith('uuid-1');
    });
  });
});
