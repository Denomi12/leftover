import { MigrationInterface, QueryRunner } from 'typeorm';

export class FoodItemCategory1794220967719 implements MigrationInterface {
  name = 'FoodItemCategory1794220967719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "food_items" ADD "category" character varying NOT NULL DEFAULT 'PREPARED_MEALS'`,
    );
    await queryRunner.query(`ALTER TABLE "food_items" ALTER COLUMN "category" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "food_items" DROP COLUMN "category"`);
  }
}
