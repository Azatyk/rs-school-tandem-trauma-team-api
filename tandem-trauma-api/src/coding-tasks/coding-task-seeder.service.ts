import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodingTask, CodingTaskDifficulty } from './entities/coding-task.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class CodingTaskSeederService {
  constructor(
    @InjectRepository(CodingTask)
    private readonly codingTaskRepository: Repository<CodingTask>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private readonly aiService: AiService,
  ) {}

  async seedCodingTasks(tasksPerTopic = 3) {
    const topics = await this.topicRepository.find();

    if (!topics.length) {
      throw new Error('No topics found. Seed topics first.');
    }

    let totalTasksCreated = 0;

    for (const topic of topics) {
      const generated = await this.aiService.generateCodingTasks(
        { title: topic.title, description: topic.description ?? undefined },
        tasksPerTopic,
      );

      for (const task of generated.tasks) {
        const existing = await this.codingTaskRepository.findOne({
          where: { title: task.title, topic: { id: topic.id } },
        });

        if (existing) continue;

        const codingTask = this.codingTaskRepository.create({
          title: task.title,
          description: task.description,
          starter_code: task.starterCode,
          solution_code: task.solutionCode,
          test_cases: task.testCases,
          difficulty: task.difficulty as CodingTaskDifficulty,
          topic,
        });

        await this.codingTaskRepository.save(codingTask);
        totalTasksCreated++;
      }
    }

    return {
      success: true,
      topicsProcessed: topics.length,
      totalTasksCreated,
    };
  }
}