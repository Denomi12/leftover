import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { FoodUnit } from '../../../src/utils/types/food-unit.type.js';
import { HouseholdEntity } from './household.entity.js';

@Entity('shopping_items')
export class ShoppingItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'household_id', type: 'uuid' })
  householdId!: string;

  @ManyToOne(() => HouseholdEntity, (household) => household.shoppingItems, {
    onDelete: 'CASCADE',
  })
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
  unit!: FoodUnit;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;
}
