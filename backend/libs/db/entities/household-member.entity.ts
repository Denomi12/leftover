import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  type Relation,
} from 'typeorm';
import { HouseholdRole } from '../../../src/utils/types/household-role.type.js';
import { UserEntity } from './user.entity.js';
import { HouseholdEntity } from './household.entity.js';

@Entity('household_members')
@Unique(['userId', 'householdId'])
export class HouseholdMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<UserEntity>;

  @Column({ name: 'household_id', type: 'uuid' })
  householdId!: string;

  @ManyToOne(() => HouseholdEntity, (household) => household.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household!: Relation<HouseholdEntity>;

  @Column({ type: 'varchar' })
  role!: HouseholdRole;
}
