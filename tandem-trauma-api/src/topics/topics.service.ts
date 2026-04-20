import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { GetTopicsDto } from './dto/get-topics.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Question, QuestionDifficulty } from 'src/questions/entities/question.entity';

@Injectable()
export class TopicsService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicsRepository: Repository<Topic>,
        @InjectRepository(Question)
        private readonly questionsRepository: Repository<Question>,
    ) {}

    async findAll(dto: GetTopicsDto): Promise<{ data: Topic[], total: number, page: number, limit: number }> {
        const { page = 1, limit = 10, search } = dto;

        const [data, total] = await this.topicsRepository.findAndCount({
            where: search ? { title: ILike(`%${search}%`) } : {},
            take: limit,
            skip: (page - 1) * limit,
        })

        return { data, total, page, limit };
    }

    async findOne(id: string): Promise<Topic> {

        const topic = await this.topicsRepository.findOne({ where: { id }})

        if (!topic) {
            throw new NotFoundException(`Topic with id ${id} not found`)
        }

        return topic;
    }

    async create(dto: CreateTopicDto): Promise<Topic> {
        const topic = this.topicsRepository.create(dto);
        return this.topicsRepository.save(topic);
    }

    async getDifficultySummary(id: string): Promise<{
        topicId: string;
        topic: string;
        counts: Record<QuestionDifficulty, number>;
    }> {
        const topic = await this.findOne(id);

        const rawCounts = await this.questionsRepository
            .createQueryBuilder('question')
            .select('question.difficulty', 'difficulty')
            .addSelect('COUNT(*)', 'count')
            .where('question.topic_id = :topicId', { topicId: id })
            .groupBy('question.difficulty')
            .getRawMany<{ difficulty: QuestionDifficulty; count: string }>();

        const counts: Record<QuestionDifficulty, number> = {
            [QuestionDifficulty.EASY]: 0,
            [QuestionDifficulty.MEDIUM]: 0,
            [QuestionDifficulty.HARD]: 0,
        };

        for (const row of rawCounts) {
            counts[row.difficulty] = Number(row.count);
        }

        return {
            topicId: topic.id,
            topic: topic.title,
            counts,
        };
    }

}
