import { BaseEntity } from "src/common/base.entity";
import { Topic } from "src/topics/entities/topic.entity";
import { Exclude } from 'class-transformer';
import { Entity,PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { UserAnswer } from "src/user-answers/entities/user-answer.entity";

@Entity('questions')
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    theoretical_question: string;

    @Exclude()
    @Column({ type: 'text' })
    golden_answer: string;

    @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
    userAnswers: UserAnswer[];

    @ManyToOne(() => Topic, (topic) => topic.questions)
    topic: Topic
}