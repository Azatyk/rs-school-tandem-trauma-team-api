import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateTopicDto } from './dto/create-topic.dto';
import { GetTopicsDto } from './dto/get-topics.dto';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
    constructor(private readonly topicsService: TopicsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all topics' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Optional text search against the topic title',
        example: 'Type',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of topics per page',
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of topics',
        schema: {
            example: {
                data: [{
                    id: '8ad7213c-38e4-4828-a9b9-3afc0d1c02b2',
                    title: 'TypeScript',
                    description: 'Static typing, interfaces, generics and type safety in JS',
                    createdAt: '2026-04-20T13:40:37.754Z',
                }],
                total: 8,
                page: 1,
                limit: 10,
            }
        }
    })
    findAll(@Query() dto: GetTopicsDto) {
        return this.topicsService.findAll(dto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one topic' })
    @ApiResponse({
        status: 200,
        description: 'Returns single topic',
        schema: {
            example: {
                id: '8ad7213c-38e4-4828-a9b9-3afc0d1c02b2',
                title: 'TypeScript',
                description: 'Static typing, interfaces, generics and type safety in JS',
                createdAt: '2026-04-20T13:40:37.754Z',
                updatedAt: '2026-04-20T13:48:13.027Z',
                deletedAt: null
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Topic not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Topic with id 123e4567 not found',
                error: 'Not Found'
            }
        }
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.topicsService.findOne(id)
    }

    @Get(':id/difficulty-summary')
    @ApiOperation({ summary: 'Get difficulty summary for a topic' })
    @ApiResponse({
        status: 200,
        description: 'Returns easy/medium/hard question counts for a topic',
        schema: {
            example: {
                topicId: '123e4567-e89b-12d3-a456-426614174000',
                topic: 'TypeScript',
                counts: {
                    easy: 5,
                    medium: 8,
                    hard: 4,
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Topic not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Topic with id 123e4567 not found',
                error: 'Not Found'
            }
        }
    })
    getDifficultySummary(@Param('id', ParseUUIDPipe) id: string) {
        return this.topicsService.getDifficultySummary(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a topic' })
    @ApiBody({ type: CreateTopicDto })
    @ApiResponse({
        status: 201,
        description: 'Topic created successfully',
        type: Topic
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error',
        schema: {
            example: {
                statusCode: 400,
                message: ['title must be longer than 5 characters'],
                error: 'Bad Request'
            }
        }
    })
    create(@Body() dto: CreateTopicDto) {
        return this.topicsService.create(dto)
    }
}
