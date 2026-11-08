import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { HouseholdEntity } from './household.entity.js';

@Entity('food_items')
export class FoodItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'household_id', type: 'uuid' })
  householdId!: string;

  @ManyToOne(() => HouseholdEntity, (household) => household.foodItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household!: Relation<HouseholdEntity>;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 3,
  })
  quantity!: string;

  @Column({ type: 'varchar' })
  unit!: string;

  @Column({
    name: 'expiration_date',
    type: 'date',
    nullable: true,
  })
  expirationDate!: string | null;
}
