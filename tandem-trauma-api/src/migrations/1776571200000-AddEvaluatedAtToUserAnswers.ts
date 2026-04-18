import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEvaluatedAtToUserAnswers1776571200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_answers',
      new TableColumn({
        name: 'evaluated_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_answers', 'evaluated_at');
  }
}
