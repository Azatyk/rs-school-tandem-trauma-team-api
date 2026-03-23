import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateTopicDto } from './dto/create-topic.dto';
import { GetTopicsDto } from './dto/get-topics.dto';
import { TopicsService } from './topics.service';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
    constructor(private readonly topicsService: TopicsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all topics' })
    findAll(@Query() dto: GetTopicsDto) {
        return this.topicsService.findAll(dto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one topic' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.topicsService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a topic' })
    create(@Body() dto: CreateTopicDto) {
        return this.topicsService.create(dto)
    }
}