import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774424402568 implements MigrationInterface {
    name = 'Migration1774424402568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topics" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "theoretical_question" text NOT NULL, "golden_answer" text NOT NULL, "topicId" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_answers_status_enum" AS ENUM('pending', 'success', 'error')`);
        await queryRunner.query(`CREATE TABLE "user_answers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer_text" text NOT NULL, "ai_score" numeric(3,1), "ai_feedback" json, "ai_advice" text, "status" "public"."user_answers_status_enum" NOT NULL DEFAULT 'pending', "evaluated_at" TIMESTAMP, "userId" uuid, "questionId" uuid, CONSTRAINT "PK_08977c1a2a5f1b8b472dbd87d04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password_hash" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_e5d76861587b8a6472ec7a26c74" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_23984f136e23ff9a75e7c9c3c27" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_47a3ffddaba37b9707f93e4b140" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_47a3ffddaba37b9707f93e4b140"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_23984f136e23ff9a75e7c9c3c27"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_e5d76861587b8a6472ec7a26c74"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_answers"`);
        await queryRunner.query(`DROP TYPE "public"."user_answers_status_enum"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "topics"`);
    }

}
