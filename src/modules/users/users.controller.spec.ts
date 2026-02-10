import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';

const mockUsersService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: ReturnType<typeof mockUsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useFactory: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to service and return result', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      const response: UserResponseDto = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        teamId: null,
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
    it('should return an array of users', async () => {
      const response: UserResponseDto[] = [];
      service.findAll.mockResolvedValue(response);

      expect(await controller.findAll()).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const response: UserResponseDto = {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.findOne.mockResolvedValue(response);

      expect(await controller.findOne('uuid-1')).toEqual(response);
    });
  });

  describe('update', () => {
    it('should delegate to service', async () => {
      const dto = { firstName: 'Jane' };
      const response: UserResponseDto = {
        id: 'uuid-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        teamId: null,
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
