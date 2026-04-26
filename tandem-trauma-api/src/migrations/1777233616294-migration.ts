import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777233616294 implements MigrationInterface {
    name = 'Migration1777233616294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."coding_tasks_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TABLE "coding_tasks" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "starter_code" text NOT NULL, "solution_code" text NOT NULL, "test_cases" json NOT NULL, "difficulty" "public"."coding_tasks_difficulty_enum" NOT NULL DEFAULT 'medium', "topic_id" uuid, CONSTRAINT "PK_abe275ed9398bd855d93bb90ffe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coding_tasks" ADD CONSTRAINT "FK_4f7df94dcd0ef4404eb428b58c9" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_tasks" DROP CONSTRAINT "FK_4f7df94dcd0ef4404eb428b58c9"`);
        await queryRunner.query(`DROP TABLE "coding_tasks"`);
        await queryRunner.query(`DROP TYPE "public"."coding_tasks_difficulty_enum"`);
    }

}
