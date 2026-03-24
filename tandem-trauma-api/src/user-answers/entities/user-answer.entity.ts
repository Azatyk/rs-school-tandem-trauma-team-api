import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";
import { Question } from "src/questions/entities/question.entity";
import { BaseEntity } from "src/common/base.entity";

export enum AnswerStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error'
}

@Entity('user_answers')
export class UserAnswer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    answer_text: string;

    @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
    ai_score: number | null;

    @Column({ type: 'json', nullable: true })
    ai_feedback: object | null;

    @Column({ type: 'text', nullable: true })
    ai_advice: string | null;

    @Column({ type: 'enum', enum: AnswerStatus, default: AnswerStatus.PENDING })
    status: AnswerStatus;

    @Column({ type: 'timestamp', nullable: true })
    evaluated_at: Date | null;

    @ManyToOne(() => User, (user) => user.userAnswers)
    user: User;

    @ManyToOne(() => Question, (question) => question.userAnswers)
    question: Question;
}