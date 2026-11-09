import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShoppingItemSource1794240000000 implements MigrationInterface {
  name = 'ShoppingItemSource1794240000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shopping_items" ADD "source" character varying NOT NULL DEFAULT 'MEAL_PLAN'`,
    );
    await queryRunner.query(`ALTER TABLE "shopping_items" ALTER COLUMN "source" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "shopping_items" DROP COLUMN "source"`);
  }
}
