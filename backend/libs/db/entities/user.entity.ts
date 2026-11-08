import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { HouseholdMemberEntity } from './household-member.entity.js';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @OneToMany(() => HouseholdMemberEntity, (member) => member.user)
  memberships?: Relation<HouseholdMemberEntity[]>;
}
