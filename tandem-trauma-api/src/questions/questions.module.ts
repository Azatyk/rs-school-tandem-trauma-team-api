import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { Question } from "./entities/question.entity";
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TopicsModule } from "src/topics/topics.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Question]),
        TopicsModule,
    ],
    exports: [QuestionsService, TypeOrmModule],
    controllers: [QuestionsController],
    providers: [QuestionsService]
})

export class QuestionsModule {}