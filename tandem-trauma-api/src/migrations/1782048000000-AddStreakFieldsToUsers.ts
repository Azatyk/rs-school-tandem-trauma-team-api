import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStreakFieldsToUsers1782048000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'current_streak',
        type: 'int',
        default: 0,
        isNullable: false,
      }),
      new TableColumn({
        name: 'longest_streak',
        type: 'int',
        default: 0,
        isNullable: false,
      }),
      new TableColumn({
        name: 'last_active_date',
        type: 'date',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'last_active_date');
    await queryRunner.dropColumn('users', 'longest_streak');
    await queryRunner.dropColumn('users', 'current_streak');
  }
}

