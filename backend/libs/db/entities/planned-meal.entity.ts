import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { HouseholdEntity } from './household.entity.js';
import { MealIngredientEntity } from './meal-ingredient.entity.js';

@Entity('planned_meals')
export class PlannedMealEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'household_id', type: 'uuid' })
  householdId!: string;

  @ManyToOne(() => HouseholdEntity, (household) => household.plannedMeals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household!: Relation<HouseholdEntity>;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @OneToMany(() => MealIngredientEntity, (ingredient) => ingredient.plannedMeal)
  ingredients?: Relation<MealIngredientEntity[]>;
}
