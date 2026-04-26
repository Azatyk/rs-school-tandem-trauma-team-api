import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Topic } from 'src/topics/entities/topic.entity';

export enum CodingTaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface TestCase {
  input: string;
  expected: string;
  description: string;
}

@Entity('coding_tasks')
export class CodingTask extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  starter_code!: string;

  @Column({ type: 'text' })
  solution_code!: string;

  @Column({ type: 'json' })
  test_cases!: TestCase[];

  @Column({
    type: 'enum',
    enum: CodingTaskDifficulty,
    default: CodingTaskDifficulty.MEDIUM,
  })
  difficulty!: CodingTaskDifficulty;

  @ManyToOne(() => Topic, (topic) => topic.id)
  @JoinColumn({ name: 'topic_id' })
  topic!: Topic;
}