import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { QuestionsService } from "./questions.service";
import { GetQuestionsDto } from "./dto/get-questions.dto";
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all questions' })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of questions',
        schema: {
            example: {
                data: [{
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    theoretical_question: 'What is event loop in JavaScript?',
                    topic: {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        title: 'JavaScript',
                        description: 'Core JavaScript concepts'
                    }
                }],
                total: 50,
                page: 1,
                limit: 10
            }

        }
    })
    findAll(@Query() dto: GetQuestionsDto) {
        return this.questionsService.findAll(dto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one question' })
    @ApiResponse({
        status: 200,
        description: 'Returns single question',
        type: Question
    })
    @ApiResponse({
        status: 404,
        description: 'Question not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Question with id 123e4567 not found',
                error: 'Not Found'
            }
        }
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionsService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a question' })
    @ApiBody({ type: CreateQuestionDto })
    @ApiResponse({
        status: 201,
        description: 'Question created successfully',
        type: Question
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error',
        schema: {
            example: {
                statusCode: 400,
                message: ['theoretical_question must be longer than 10 characters'],
                error: 'Bad Request'
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
        create(@Body() dto: CreateQuestionDto) {
        return this.questionsService.create(dto)
    }
}