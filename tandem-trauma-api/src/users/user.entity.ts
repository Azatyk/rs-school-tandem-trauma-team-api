import { BaseEntity } from 'src/common/base.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash!: string;

  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak!: number;

  @Column({ name: 'longest_streak', type: 'int', default: 0 })
  longestStreak!: number;

  @Column({ name: 'last_active_date', type: 'date', nullable: true })
  lastActiveDate!: string | null;

  @Column({ name: 'xp', type: 'int', default: 0 })
  xp!: number;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
  userAnswers!: UserAnswer[];
}
