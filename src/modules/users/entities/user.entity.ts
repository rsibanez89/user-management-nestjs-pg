import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

/**
 * User entity representing a system user.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @ManyToOne(() => Team, (team) => team.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  team!: Team | null;

  @Column({ nullable: true })
  teamId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
