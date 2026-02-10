/**
 * Response DTO for user data returned by the API.
 */
export class UserResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  teamId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  /**
   * Maps a user entity to a response DTO.
   */
  static fromEntity(entity: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    teamId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.email = entity.email;
    dto.teamId = entity.teamId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
