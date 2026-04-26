import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777239792573 implements MigrationInterface {
    name = 'Migration1777239792573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
    }

}
