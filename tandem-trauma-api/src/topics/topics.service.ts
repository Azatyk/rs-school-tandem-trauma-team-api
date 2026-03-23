import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { GetTopicsDto } from './dto/get-topics.dto';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicsService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicsRepository: Repository<Topic>,
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

}