import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDifficulty } from 'src/questions/entities/question.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import {
  ProfileResponse,
  ProfileSolvedBreakdown,
} from './interfaces/profile.interfaces';

const XP_BY_DIFFICULTY: Record<QuestionDifficulty, number> = {
  [QuestionDifficulty.EASY]: 10,
  [QuestionDifficulty.MEDIUM]: 25,
  [QuestionDifficulty.HARD]: 50,
};

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
  ) {}

  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'name',
        'email',
        'createdAt',
        'currentStreak',
        'longestStreak',
        'lastActiveDate',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const rows = await this.userAnswerRepository
      .createQueryBuilder('ua')
      .innerJoin('ua.question', 'q')
      .select('q.difficulty', 'difficulty')
      .addSelect('COUNT(DISTINCT q.id)', 'count')
      .where('ua.user_id = :userId', { userId })
      .andWhere('ua.ai_score IS NOT NULL')
      .andWhere('ua.ai_score >= :minScore', { minScore: 7.0 })
      .groupBy('q.difficulty')
      .getRawMany<{ difficulty: QuestionDifficulty; count: string }>();

    const solved: ProfileSolvedBreakdown = { easy: 0, medium: 0, hard: 0 };

    for (const row of rows) {
      const difficulty = row.difficulty;
      const count = Number.parseInt(row.count, 10) || 0;

      if (difficulty === QuestionDifficulty.EASY) solved.easy = count;
      if (difficulty === QuestionDifficulty.MEDIUM) solved.medium = count;
      if (difficulty === QuestionDifficulty.HARD) solved.hard = count;
    }

    const totalSolvedTasks = solved.easy + solved.medium + solved.hard;
    const xp =
      solved.easy * XP_BY_DIFFICULTY[QuestionDifficulty.EASY] +
      solved.medium * XP_BY_DIFFICULTY[QuestionDifficulty.MEDIUM] +
      solved.hard * XP_BY_DIFFICULTY[QuestionDifficulty.HARD];

    const recentActivity = await this.userAnswerRepository
      .createQueryBuilder('ua')
      .innerJoin('ua.question', 'q')
      .select('q.id', 'taskId')
      .addSelect('q.theoretical_question', 'title')
      .addSelect('ua.evaluated_at', 'completedAt')
      .where('ua.user_id = :userId', { userId })
      .andWhere('ua.ai_score IS NOT NULL')
      .andWhere('ua.ai_score >= :minScore', { minScore: 7.0 })
      .andWhere('ua.evaluated_at IS NOT NULL')
      .orderBy('ua.evaluated_at', 'DESC')
      .limit(10)
      .getRawMany<{ taskId: string; title: string; completedAt: Date }>();

    const topicRows = await this.userAnswerRepository
      .createQueryBuilder('ua')
      .innerJoin('ua.question', 'q')
      .innerJoin('q.topic', 't')
      .select('t.title', 'topicTitle')
      .addSelect('COUNT(DISTINCT q.id)', 'solvedCount')
      .where('ua.user_id = :userId', { userId })
      .andWhere('ua.ai_score IS NOT NULL')
      .andWhere('ua.ai_score >= :minScore', { minScore: 7.0 })
      .groupBy('t.title')
      .getRawMany<{ topicTitle: string; solvedCount: string }>();

    const topicTotals = await this.userRepository.manager
      .createQueryBuilder()
      .select('t.title', 'topicTitle')
      .addSelect('COUNT(q.id)', 'totalCount')
      .from('topics', 't')
      .innerJoin('questions', 'q', 'q.topic_id = t.id')
      .groupBy('t.title')
      .getRawMany<{ topicTitle: string; totalCount: string }>();

    const totalsMap = new Map<string, number>();
    for (const row of topicTotals) {
      totalsMap.set(row.topicTitle, Number.parseInt(row.totalCount, 10) || 0);
    }

    const topicMastery: Record<string, number> = {};
    for (const row of topicRows) {
      const solvedCount = Number.parseInt(row.solvedCount, 10) || 0;
      const totalCount = totalsMap.get(row.topicTitle) ?? 0;

      topicMastery[row.topicTitle] =
        totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
    }

    return {
      name: user.name,
      email: user.email,
      memberSince: user.createdAt.toISOString(),
      xp,
      stats: {
        currentStreak: user.currentStreak ?? 0,
        longestStreak: user.longestStreak ?? 0,
        totalSolvedTasks,
      },
      difficultyBreakdown: solved,
      topicMastery,
    };
  }
}
