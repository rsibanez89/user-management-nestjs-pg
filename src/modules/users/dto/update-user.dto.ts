import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

/**
 * DTO for updating an existing user. All fields are optional.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
