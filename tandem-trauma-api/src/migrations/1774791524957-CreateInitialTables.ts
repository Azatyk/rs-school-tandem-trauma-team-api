import { MigrationInterface, QueryRunner } from "typeorm";
import { Table } from "typeorm";
import { TableForeignKey } from "typeorm";

const baseColumns = [
    {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'uuid' as const,
    },
    {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
    },
    {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
    },
    {
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
    },
]

export class CreateInitialTables1774791524957 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    ...baseColumns,
                    {
                        name: "email",
                        type: "varchar",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                    }
                ],
            }),
            true,
        )

        await queryRunner.createTable(
            new Table({
                name: "topics",
                columns: [
                    ...baseColumns,
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                ],
            }),
            true,
        )

        await queryRunner.createTable(
            new Table({
                name: "questions",
                columns: [
                    ...baseColumns,
                    {
                        name: "theoretical_question",
                        type: "text",
                    },
                    {
                        name: "golden_answer",
                        type: "text",
                    },
                    {
                        name: "topic_id",
                        type: "uuid",
                        isNullable: false,
                    }
                ],
            }),
            true,
        )

        await queryRunner.createTable(
            new Table({
                name: "user_answers",
                columns: [
                    ...baseColumns,
                    {
                        name: "answer_text",
                        type: "text",
                    },
                    {
                        name: "ai_score",
                        type: "numeric",
                        precision: 3,
                        scale: 1,
                        isNullable: true,
                    },
                    {
                        name: "ai_feedback",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "ai_advice",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "status", default: "'pending'",
                        type: "enum",
                        enum: ["pending", "success", "error"],
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'question_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
            }),
            true,
        )

        await queryRunner.createForeignKey(
            "questions",
            new TableForeignKey({
                columnNames: ["topic_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "topics",
                onDelete: "CASCADE",
            }),
        )

         await queryRunner.createForeignKey(
            'user_answers',
            new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }))

        await queryRunner.createForeignKey(
            'user_answers',
            new TableForeignKey({
            columnNames: ['question_id'],
            referencedTableName: 'questions',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }))
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_answers');
        await queryRunner.dropTable('questions');
        await queryRunner.dropTable('topics');
        await queryRunner.dropTable('users');
    }
}
