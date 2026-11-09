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
import { PlannedMealEntity } from './planned-meal.entity.js';

@Entity('meal_ingredients')
export class MealIngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'planned_meal_id', type: 'uuid' })
  plannedMealId!: string;

  @ManyToOne(() => PlannedMealEntity, (meal) => meal.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planned_meal_id' })
  plannedMeal!: Relation<PlannedMealEntity>;

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
}
