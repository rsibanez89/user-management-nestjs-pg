import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

/**
 * Service handling all user-related business logic.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Creates a new user. */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException(
        `User with email "${createUserDto.email}" already exists`,
      );
    }

    const user = this.userRepository.create(createUserDto);
    const saved = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(saved);
  }

  /** Returns all users. */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  /** Returns a single user by ID. */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return UserResponseDto.fromEntity(user);
  }

  /** Updates a user by ID. */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException(
          `User with email "${updateUserDto.email}" already exists`,
        );
      }
    }

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(saved);
  }

  /** Removes a user by ID. */
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    await this.userRepository.remove(user);
  }
}
