import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "./entities/question.entity";
import { Repository, ILike } from 'typeorm';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { TopicsService } from 'src/topics/topics.service';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private readonly questionsRepository: Repository<Question>,
        private readonly topicsService: TopicsService,
    ) {}

    async findAll(dto: GetQuestionsDto): Promise<{ data: Question[], total: number, page: number, limit: number }> {
        const { page = 1, limit = 10, search, topicId } = dto;


        const [data, total] = await this.questionsRepository.findAndCount({
           where: {
                ...(topicId && { topic: { id: topicId } }),
                ...(search && { theoretical_question: ILike(`%${search}%`) }),
            },
            take: limit,
            skip: (page - 1) * limit,
        })

        return { data, total, page, limit };
    }

    async findOne(id: string): Promise<Question> {

        const question = await this.questionsRepository.findOne({ where: { id }})

        if (!question) {
            throw new NotFoundException(`Question with id ${id} not found`)
        }

        return question;
    }

    async create(dto: CreateQuestionDto): Promise<Question> {
        await this.topicsService.findOne(dto.topicId)
        const question = this.questionsRepository.create(dto);
        return this.questionsRepository.save(question);
    }
}