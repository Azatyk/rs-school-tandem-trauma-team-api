import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of topics',
        schema: {
            example: {
                data: [{
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    title: 'JavaScript',
                    description: 'Core JavaScript concepts',
                    createdAt: '2026-03-25T09:07:59.097Z',
                }],
                total: 50,
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
        type: Topic
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