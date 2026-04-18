import { BaseEntity } from "src/common/base.entity";
import { Question } from "src/questions/entities/question.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('topics')
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @OneToMany(() => Question, (question) => question.topic)
  questions!: Question[];
}
