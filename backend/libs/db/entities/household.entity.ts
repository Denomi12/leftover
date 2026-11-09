import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { HouseholdMemberEntity } from './household-member.entity.js';
import { HouseholdInvitationEntity } from './household-invitation.entity.js';
import { FoodItemEntity } from './food-item.entity.js';
import { PlannedMealEntity } from './planned-meal.entity.js';
import { ShoppingItemEntity } from './shopping-item.entity.js';

@Entity('households')
export class HouseholdEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => HouseholdMemberEntity, (member) => member.household)
  members?: Relation<HouseholdMemberEntity[]>;

  @OneToMany(() => HouseholdInvitationEntity, (invitation) => invitation.household)
  invitations?: Relation<HouseholdInvitationEntity[]>;

  @OneToMany(() => FoodItemEntity, (item) => item.household)
  foodItems?: Relation<FoodItemEntity[]>;

  @OneToMany(() => PlannedMealEntity, (meal) => meal.household)
  plannedMeals?: Relation<PlannedMealEntity[]>;

  @OneToMany(() => ShoppingItemEntity, (item) => item.household)
  shoppingItems?: Relation<ShoppingItemEntity[]>;
}
