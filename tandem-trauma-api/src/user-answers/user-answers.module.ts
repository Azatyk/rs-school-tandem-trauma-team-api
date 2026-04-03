import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswer } from './entities/user-answer.entity';
import { AiModule } from 'src/ai/ai.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { UserAnswersController } from './user-answers.controller';
import { UserAnswersService } from './user-answers.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserAnswer]),
        AiModule,
        QuestionsModule,
    ],
    exports: [UserAnswersService, TypeOrmModule],
    controllers: [UserAnswersController],
    providers: [UserAnswersService]
})
export class UserAnswersModule {}