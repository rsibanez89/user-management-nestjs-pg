import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';
import { TeamResponseDto } from './dto/team-response.dto.js';

/**
 * Service handling all team-related business logic.
 */
@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  /** Creates a new team. */
  async create(createTeamDto: CreateTeamDto): Promise<TeamResponseDto> {
    const existing = await this.teamRepository.findOne({
      where: { name: createTeamDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Team with name "${createTeamDto.name}" already exists`,
      );
    }

    const team = this.teamRepository.create(createTeamDto);
    const saved = await this.teamRepository.save(team);
    return TeamResponseDto.fromEntity(saved);
  }

  /** Returns all teams. */
  async findAll(): Promise<TeamResponseDto[]> {
    const teams = await this.teamRepository.find({
      order: { name: 'ASC' },
    });
    return teams.map((team) => TeamResponseDto.fromEntity(team));
  }

  /** Returns a single team by ID. */
  async findOne(id: string): Promise<TeamResponseDto> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID "${id}" not found`);
    }
    return TeamResponseDto.fromEntity(team);
  }

  /** Updates a team by ID. */
  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamResponseDto> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID "${id}" not found`);
    }

    if (updateTeamDto.name && updateTeamDto.name !== team.name) {
      const existing = await this.teamRepository.findOne({
        where: { name: updateTeamDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Team with name "${updateTeamDto.name}" already exists`,
        );
      }
    }

    Object.assign(team, updateTeamDto);
    const saved = await this.teamRepository.save(team);
    return TeamResponseDto.fromEntity(saved);
  }

  /** Removes a team by ID. */
  async remove(id: string): Promise<void> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID "${id}" not found`);
    }
    await this.teamRepository.remove(team);
  }
}
