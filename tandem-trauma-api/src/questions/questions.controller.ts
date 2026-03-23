import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuestionsService } from "./questions.service";
import { GetQuestionsDto } from "./dto/get-questions.dto";
import { CreateQuestionDto } from './dto/create-question.dto';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all questions' })
    findAll(@Query() dto: GetQuestionsDto) {
        return this.questionsService.findAll(dto)
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get one question' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionsService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a question' })
    create(@Body() dto: CreateQuestionDto) {
        return this.questionsService.create(dto)
    }
}