import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupTable1717623860611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE "group" (
        "id" SERIAL PRIMARY KEY,
        "productId" VARCHAR NOT NULL,
        "maxMembers" INT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE "group"
`);
  }
}
