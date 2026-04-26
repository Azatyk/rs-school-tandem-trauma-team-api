import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777234309161 implements MigrationInterface {
    name = 'Migration1777234309161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "xp" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "xp"`);
    }

}
