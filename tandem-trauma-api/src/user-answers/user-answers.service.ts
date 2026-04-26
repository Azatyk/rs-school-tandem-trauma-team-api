import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerStatus, UserAnswer } from './entities/user-answer.entity';
import { AiService } from 'src/ai/ai.service';
import { GetUserAnswersDto } from './dto/get-user-answers.dto';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { EvaluateAnswerResult } from 'src/ai/interfaces/ai.interfaces';

@Injectable()
export class UserAnswersService {
  constructor(
    @InjectRepository(UserAnswer)
    private readonly userAnswersRepository: Repository<UserAnswer>,
    private readonly questionsService: QuestionsService,
    private readonly aiService: AiService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(dto: GetUserAnswersDto): Promise<{
    data: UserAnswer[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, userId, questionId, status } = dto;

    const [data, total] = await this.userAnswersRepository.findAndCount({
      where: {
        ...(questionId && { question: { id: questionId } }),
        ...(userId && { user: { id: userId } }),
        ...(status && { status }),
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const answer = await this.userAnswersRepository.findOne({ where: { id } });

    if (!answer) {
      throw new NotFoundException(`Answer with the ${id} not found`);
    }

    return answer;
  }

  async create(dto: CreateUserAnswerDto, userId: string): Promise<UserAnswer> {
    const question = await this.questionsService.findOne(dto.questionId);

    const answer = this.userAnswersRepository.create({
      answer_text: dto.answerText,
      user: { id: userId },
      question: { id: dto.questionId },
      status: AnswerStatus.PENDING,
    });

    const savedAnswer = await this.userAnswersRepository.save(answer);

    let evaluation: EvaluateAnswerResult | null = null;

    try {
      evaluation = await this.aiService.evaluateAnswer(
        question.theoretical_question,
        question.golden_answer,
        dto.answerText,
      );
    } catch {
      evaluation = null;
    }

    const evaluatedAt = new Date();
    const isSolved = evaluation?.score != null && evaluation.score >= 7.0;

    return this.dataSource.transaction(async (manager) => {
      const uaRepo = manager.getRepository(UserAnswer);
      const userRepo = manager.getRepository(User);

      const ua = await uaRepo.findOne({
        where: { id: savedAnswer.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!ua) {
        throw new NotFoundException(
          `Answer with the ${savedAnswer.id} not found`,
        );
      }

      if (!evaluation) {
        ua.status = AnswerStatus.ERROR;
        return uaRepo.save(ua);
      }

      ua.ai_score = evaluation.score;
      ua.ai_feedback = evaluation.feedback;
      ua.ai_advice = evaluation.advice;
      ua.ai_rubrics = evaluation.rubrics;
      ua.status = AnswerStatus.SUCCESS;
      ua.evaluated_at = evaluatedAt;

      const saved = await uaRepo.save(ua);

      if (!isSolved) {
        return saved;
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const today = new Date().toISOString().slice(0, 10);
      const now = new Date();
      const yesterday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
      )
        .toISOString()
        .slice(0, 10);
      //logic for updating streak if lastactivedate is not today
      if (user.lastActiveDate !== today) {
        if (user.lastActiveDate === yesterday) {
          user.currentStreak = (user.currentStreak ?? 0) + 1;
        } else {
          user.currentStreak = 1;
        }
        if (user.currentStreak > (user.longestStreak ?? 0)) {
          user.longestStreak = user.currentStreak;
        }
        user.lastActiveDate = today;
        await userRepo.save(user);
      }
      return saved;
    });
  }
}
