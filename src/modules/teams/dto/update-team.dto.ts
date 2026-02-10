import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

/**
 * DTO for updating an existing team. All fields are optional.
 */
export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
