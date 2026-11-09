import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { HouseholdRole } from '../../../src/utils/types/household-role.type.js';
import { HouseholdInvitationStatus } from '../../../src/utils/types/household-invitation-status.type.js';
import { HouseholdEntity } from './household.entity.js';
import { UserEntity } from './user.entity.js';

@Entity('household_invitations')
@Index(['householdId', 'invitedUserId'], {
  unique: true,
  where: `"status" = '${HouseholdInvitationStatus.Pending}'`,
})
@Index(['invitedUserId', 'status'])
export class HouseholdInvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'household_id', type: 'uuid' })
  householdId!: string;

  @ManyToOne(() => HouseholdEntity, (household) => household.invitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household!: Relation<HouseholdEntity>;

  @Column({ name: 'invited_user_id', type: 'uuid' })
  invitedUserId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invited_user_id' })
  invitedUser!: Relation<UserEntity>;

  @Column({ name: 'invited_by_user_id', type: 'uuid' })
  invitedByUserId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invited_by_user_id' })
  invitedByUser!: Relation<UserEntity>;

  @Column({ type: 'varchar' })
  role!: HouseholdRole;

  @Column({ type: 'varchar', default: HouseholdInvitationStatus.Pending })
  status!: HouseholdInvitationStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt!: Date | null;
}
