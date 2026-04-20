import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { Question } from 'src/questions/entities/question.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Topic, Question]),
    ],
    exports: [TopicsService, TypeOrmModule],
    controllers: [TopicsController],
    providers: [TopicsService]
})
export class TopicsModule {}
