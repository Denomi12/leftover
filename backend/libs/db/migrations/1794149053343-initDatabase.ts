import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1794149053343 implements MigrationInterface {
  name = 'InitDatabase1794149053343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "food_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "household_id" uuid NOT NULL, "name" character varying NOT NULL, "quantity" numeric(10,3) NOT NULL, "unit" character varying NOT NULL, "expiration_date" date, CONSTRAINT "PK_6b37e62b21c674c714a581c59a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82b2ab56b3c7761f7779c44e83" ON "food_items"  ("household_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "meal_ingredients" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "planned_meal_id" uuid NOT NULL, "name" character varying NOT NULL, "quantity" numeric(10,3) NOT NULL, "unit" character varying NOT NULL, CONSTRAINT "PK_d74c701d219b7fb9704f63b4f2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09f3791753e15422432b25b646" ON "meal_ingredients"  ("planned_meal_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "planned_meals" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "household_id" uuid NOT NULL, "name" character varying NOT NULL, "date" date NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f0123975137ef993eccfa79fd0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09c2f25f5d78617bc0e41fe14f" ON "planned_meals"  ("household_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "shopping_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "household_id" uuid NOT NULL, "name" character varying NOT NULL, "quantity" numeric(10,3) NOT NULL, "unit" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_36f295ec7314c9001968ca2c6f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21d6bc22ad7f1e29f62a0da136" ON "shopping_items"  ("household_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "households" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2b1aef2640717132e9231aac756" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "household_members" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "household_id" uuid NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_eda51fd15f360f367e2261c7f5a" UNIQUE ("user_id", "household_id"), CONSTRAINT "PK_198055660706bdbea68909fdb01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "food_items" ADD CONSTRAINT "FK_82b2ab56b3c7761f7779c44e83a" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "meal_ingredients" ADD CONSTRAINT "FK_09f3791753e15422432b25b6462" FOREIGN KEY ("planned_meal_id") REFERENCES "planned_meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planned_meals" ADD CONSTRAINT "FK_09c2f25f5d78617bc0e41fe14fd" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_items" ADD CONSTRAINT "FK_21d6bc22ad7f1e29f62a0da1364" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_members" ADD CONSTRAINT "FK_7e5f19ba92bb79aa4a6400e3827" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_members" ADD CONSTRAINT "FK_6b8b13e8e04d123ec8cb8b5c318" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "household_members" DROP CONSTRAINT "FK_6b8b13e8e04d123ec8cb8b5c318"`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_members" DROP CONSTRAINT "FK_7e5f19ba92bb79aa4a6400e3827"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_items" DROP CONSTRAINT "FK_21d6bc22ad7f1e29f62a0da1364"`,
    );
    await queryRunner.query(
      `ALTER TABLE "planned_meals" DROP CONSTRAINT "FK_09c2f25f5d78617bc0e41fe14fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meal_ingredients" DROP CONSTRAINT "FK_09f3791753e15422432b25b6462"`,
    );
    await queryRunner.query(
      `ALTER TABLE "food_items" DROP CONSTRAINT "FK_82b2ab56b3c7761f7779c44e83a"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "household_members"`);
    await queryRunner.query(`DROP TABLE "households"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_21d6bc22ad7f1e29f62a0da136"`);
    await queryRunner.query(`DROP TABLE "shopping_items"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_09c2f25f5d78617bc0e41fe14f"`);
    await queryRunner.query(`DROP TABLE "planned_meals"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_09f3791753e15422432b25b646"`);
    await queryRunner.query(`DROP TABLE "meal_ingredients"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_82b2ab56b3c7761f7779c44e83"`);
    await queryRunner.query(`DROP TABLE "food_items"`);
  }
}
