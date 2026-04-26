import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingTask } from './entities/coding-task.entity';
import { CodingTasksService } from './coding-tasks.service';
import { CodingTasksController } from './coding-tasks.controller';
import { AiModule } from 'src/ai/ai.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodingTask]),
    AiModule,
    TopicsModule,
  ],
  controllers: [CodingTasksController],
  providers: [CodingTasksService],
  exports: [CodingTasksService],
})
export class CodingTasksModule {}