import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CodingTask, CodingTaskDifficulty } from './entities/coding-task.entity';
import { CreateCodingTaskDto } from './dto/create-coding-task.dto';
import { GetCodingTasksDto } from './dto/get-coding-tasks.dto';
import { SubmitCodingTaskDto } from './dto/submit-coding-task.dto';
import { AiService } from 'src/ai/ai.service';
import { TopicsService } from 'src/topics/topics.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class CodingTasksService {
  constructor(
    @InjectRepository(CodingTask)
    private readonly codingTasksRepository: Repository<CodingTask>,
    private readonly aiService: AiService,
    private readonly topicsService: TopicsService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(dto: GetCodingTasksDto) {
    const { page = 1, limit = 10, topic_id, difficulty } = dto;

    const [data, total] = await this.codingTasksRepository.findAndCount({
      where: {
        ...(topic_id && { topic: { id: topic_id } }),
        ...(difficulty && { difficulty }),
      },
      relations: ['topic'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<CodingTask> {
    const task = await this.codingTasksRepository.findOne({
      where: { id },
      relations: ['topic'],
    });

    if (!task) {
      throw new NotFoundException(`Coding task with id ${id} not found`);
    }

    return task;
  }

  async create(dto: CreateCodingTaskDto): Promise<CodingTask> {
    await this.topicsService.findOne(dto.topic_id);

    const task = this.codingTasksRepository.create({
      title: dto.title,
      description: dto.description,
      starter_code: dto.starter_code,
      solution_code: dto.solution_code,
      test_cases: dto.test_cases,
      difficulty: dto.difficulty,
      topic: { id: dto.topic_id },
    });

    return this.codingTasksRepository.save(task);
  }

  async explainError(id: string, error: string, userCode: string) {
    const task = await this.findOne(id);
    return this.aiService.explainCodingError(
      task.title,
      task.description,
      userCode,
      error,
    );
  }

  async submit(id: string, dto: SubmitCodingTaskDto, userId: string) {
  const task = await this.findOne(id);

  if (!dto.passed) {
    return { xpEarned: 0, message: 'Task failed. No XP awarded.' };
  }

  const xpMap = {
    [CodingTaskDifficulty.EASY]: 10,
    [CodingTaskDifficulty.MEDIUM]: 20,
    [CodingTaskDifficulty.HARD]: 30,
  };

  const xpEarned = xpMap[task.difficulty];

  await this.dataSource.transaction(async (manager) => {
    const userRepo = manager.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!user) throw new NotFoundException('User not found');

    user.xp = (user.xp ?? 0) + xpEarned;
    await userRepo.save(user);
  });

  return {
    xpEarned,
    message: `Task passed! You earned ${xpEarned} XP.`,
  };
}

}