import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDifficultyToQuestions1776652800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'questions',
      new TableColumn({
        name: 'difficulty',
        type: 'enum',
        enum: ['easy', 'medium', 'hard'],
        default: "'medium'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('questions', 'difficulty');
  }
}
