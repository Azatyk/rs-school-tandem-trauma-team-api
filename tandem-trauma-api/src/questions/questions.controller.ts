import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
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
    @ApiQuery({
        name: 'topic_id',
        required: false,
        description: 'Filter questions by topic id',
        example: '8ad7213c-38e4-4828-a9b9-3afc0d1c02b2',
    })
    @ApiQuery({
        name: 'difficulty',
        required: false,
        description: 'Filter questions by difficulty level',
        enum: ['easy', 'medium', 'hard'],
        example: 'medium',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Optional text search against the question text',
        example: 'typescript',
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
        description: 'Number of questions per page',
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of questions',
        schema: {
            example: {
                data: [{
                    id: '2c19d7fd-0fc5-4eab-a985-6482216194bb',
                    theoretical_question: 'Explain how TypeScript type narrowing works with union types and type guards.',
                    difficulty: 'easy',
                    topic: {
                        id: '8ad7213c-38e4-4828-a9b9-3afc0d1c02b2',
                        title: 'TypeScript',
                        description: 'Static typing, interfaces, generics and type safety in JS'
                    }
                }],
                total: 17,
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
        schema: {
            example: {
                id: '2c19d7fd-0fc5-4eab-a985-6482216194bb',
                theoretical_question: 'Explain how TypeScript type narrowing works with union types and type guards.',
                difficulty: 'easy',
                topic: {
                    id: '8ad7213c-38e4-4828-a9b9-3afc0d1c02b2',
                    title: 'TypeScript',
                    description: 'Static typing, interfaces, generics and type safety in JS'
                }
            }
        }
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

    @Get(':id/hint')
    @ApiOperation({ summary: 'Get a hint for a question by level' })
    @ApiQuery({
      name: 'level',
      required: false,
      description: 'Hint level (1 = guiding question, 2 = partial direction, 3 = near-answer)',
      enum: [1, 2, 3],
      example: 1,
    })
    @ApiResponse({
      status: 200,
      schema: { example: { hint: 'Think about how TypeScript uses type guards...' } },
    })
    getHint(
      @Param('id', ParseUUIDPipe) id: string,
      @Query('level') level: string,
    ) {
      const hintLevel = (Number(level) || 1) as 1 | 2 | 3;
      return this.questionsService.getHint(id, hintLevel);
    }
}
