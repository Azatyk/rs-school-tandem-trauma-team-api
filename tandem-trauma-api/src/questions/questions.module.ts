import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TopicsModule,
  ],
  controllers: [QuestionsController, QuestionSeederController],
  providers: [QuestionsService, QuestionSeederService],
  exports: [QuestionsService, QuestionSeederService],
})
export class QuestionsModule {}
