import { BaseEntity } from 'src/common/base.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
  userAnswers: UserAnswer[];
}
