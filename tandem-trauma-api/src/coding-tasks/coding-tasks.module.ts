import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingTask } from './entities/coding-task.entity';
import { CodingTasksService } from './coding-tasks.service';
import { CodingTasksController } from './coding-tasks.controller';
import { CodingTaskSeederService } from './coding-task-seeder.service';
import { CodingTaskSeederController } from './coding-task-seeder.controller';
import { AiModule } from 'src/ai/ai.module';
import { TopicsModule } from 'src/topics/topics.module';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodingTask, Topic]),
    AiModule,
    TopicsModule,
  ],
  controllers: [CodingTasksController, CodingTaskSeederController],
  providers: [CodingTasksService, CodingTaskSeederService],
  exports: [CodingTasksService],
})
export class CodingTasksModule {}