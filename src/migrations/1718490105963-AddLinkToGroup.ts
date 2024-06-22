import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLinkToGroup1718490105963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group" ADD "link" VARCHAR NOT NULL DEFAULT 'default-link'`,
    );

    // Optionally, update the existing rows to have a unique link
    await queryRunner.query(`
        UPDATE "group" SET "link" = uuid_generate_v4()
      `);

    await queryRunner.query(`
        ALTER TABLE "group" ALTER COLUMN "link" DROP DEFAULT
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "group" DROP COLUMN "link"
      `);
  }
}
