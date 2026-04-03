import { CreateUserAnswerDto } from "./dto/create-user-answer.dto";
import { GetUserAnswersDto } from "./dto/get-user-answers.dto";
import { UserAnswer } from "./entities/user-answer.entity";
import { UserAnswersService } from "./user-answers.service";
import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('user-answers')
@Controller('user-answers')
@UseGuards(JwtAuthGuard)
export class UserAnswersController {
    constructor(private readonly userAnswersService: UserAnswersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all user answers' })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of user answers',
        schema: {
            example: {
                data: [{
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    answer_text: 'Event loop is...',
                    ai_score: 8.5,
                    ai_feedback: { strengths: '...', weaknesses: '...', accuracy: '...' },
                    ai_advice: 'Focus on...',
                    status: 'success',
                    evaluated_at: '2026-03-25T09:07:59.097Z',
                }],
                total: 100,
                page: 1,
                limit: 10,
            }
        }
    })
    findAll(@Query() dto: GetUserAnswersDto) {
        return this.userAnswersService.findAll(dto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one user answer' })
       @ApiResponse({
        status: 200,
        description: 'Returns single user answer',
        type: UserAnswer
    })
    @ApiResponse({
        status: 404,
        description: 'Answer not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Answer with id 123e4567 not found',
                error: 'Not Found'
            }
        }
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.userAnswersService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create user answer' })
    @ApiBody({ type: CreateUserAnswerDto })
    @ApiResponse({
        status: 201,
        description: 'Answer created and evaluated by AI',
        type: UserAnswer
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error',
        schema: {
            example: {
                statusCode: 400,
                message: ['answerText must be longer than 20 characters'],
                error: 'Bad Request'
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
    create(
        @Body() dto: CreateUserAnswerDto,
        @CurrentUser('userId') userId: string
    ) {
        return this.userAnswersService.create(dto, userId)
    }
}