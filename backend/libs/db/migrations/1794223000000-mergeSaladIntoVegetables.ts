import { MigrationInterface, QueryRunner } from 'typeorm';

export class MergeSaladIntoVegetables1794223000000 implements MigrationInterface {
  name = 'MergeSaladIntoVegetables1794223000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "food_items" SET "category" = 'VEGETABLES' WHERE "category" = 'SALAD'`,
    );
  }

  public async down(): Promise<void> {}
}
