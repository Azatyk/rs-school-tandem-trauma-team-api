import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777232153317 implements MigrationInterface {
    name = 'Migration1777232153317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_e29a77ea64df3fb567c4c200a9e"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_adae59e684b873b084be36c5a7a"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_d84d10f2e3b97a037d5479bf669"`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD "ai_rubrics" json`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "topic_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP COLUMN "ai_feedback"`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD "ai_feedback" json`);
        await queryRunner.query(`ALTER TABLE "user_answers" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_answers" ALTER COLUMN "question_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_e29a77ea64df3fb567c4c200a9e" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_d84d10f2e3b97a037d5479bf669" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_adae59e684b873b084be36c5a7a" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_adae59e684b873b084be36c5a7a"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_d84d10f2e3b97a037d5479bf669"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_e29a77ea64df3fb567c4c200a9e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "user_answers" ALTER COLUMN "question_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_answers" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP COLUMN "ai_feedback"`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD "ai_feedback" jsonb`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "topic_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP COLUMN "ai_rubrics"`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_d84d10f2e3b97a037d5479bf669" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_adae59e684b873b084be36c5a7a" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_e29a77ea64df3fb567c4c200a9e" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
