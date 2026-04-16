import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiModule } from 'src/ai/ai.module';
import { Topic } from '../topics/entities/topic.entity';
import { TopicsModule } from 'src/topics/topics.module';
import { Question } from './entities/question.entity';
import { QuestionSeederService } from './question-seeder.service';
import { QuestionSeederController } from './question-seeder.controller';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, Question]),
    AiModule,
    TopicsModule,
  ],
  controllers: [QuestionsController, QuestionSeederController],
  providers: [QuestionsService, QuestionSeederService],
  exports: [QuestionsService, QuestionSeederService],
})
export class QuestionsModule {}
