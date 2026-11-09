import { MigrationInterface, QueryRunner } from 'typeorm';

export class HouseholdInvitations1794166161169 implements MigrationInterface {
  name = 'HouseholdInvitations1794166161169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "household_invitations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "household_id" uuid NOT NULL, "invited_user_id" uuid NOT NULL, "invited_by_user_id" uuid NOT NULL, "role" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "responded_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0cdfc7104136992d26e6fe584d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc8eb76f2777252e37a68c3fcb" ON "household_invitations"  ("invited_user_id", "status") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_83b86a36ea87ca745b14d7abe0" ON "household_invitations"  ("household_id", "invited_user_id") WHERE "status" = 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_invitations" ADD CONSTRAINT "FK_dae78d07e961492b3c0cd30adde" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_invitations" ADD CONSTRAINT "FK_5080aa711c94aff259ddf73a135" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_invitations" ADD CONSTRAINT "FK_fe32e06b85dfc00898f651a7212" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "household_invitations" DROP CONSTRAINT "FK_fe32e06b85dfc00898f651a7212"`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_invitations" DROP CONSTRAINT "FK_5080aa711c94aff259ddf73a135"`,
    );
    await queryRunner.query(
      `ALTER TABLE "household_invitations" DROP CONSTRAINT "FK_dae78d07e961492b3c0cd30adde"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_83b86a36ea87ca745b14d7abe0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cc8eb76f2777252e37a68c3fcb"`);
    await queryRunner.query(`DROP TABLE "household_invitations"`);
  }
}
