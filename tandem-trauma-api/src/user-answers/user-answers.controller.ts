import { CreateUserAnswerDto } from "./dto/create-user-answer.dto";
import { GetUserAnswersDto } from "./dto/get-user-answers.dto";
import { UserAnswer } from "./entities/user-answer.entity";
import { UserAnswersService } from "./user-answers.service";
import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('user-answers')
@Controller('user-answers')
@UseGuards(JwtAuthGuard)
export class UserAnswersController {
    constructor(private readonly userAnswersService: UserAnswersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all user answers' })
    @ApiQuery({
        name: 'questionId',
        required: false,
        description: 'Filter answers by question id',
        example: '2c19d7fd-0fc5-4eab-a985-6482216194bb',
    })
    @ApiQuery({
        name: 'userId',
        required: false,
        description: 'Filter answers by user id',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter answers by AI evaluation status',
        enum: ['pending', 'success', 'error'],
        example: 'success',
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
        description: 'Number of answers per page',
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of user answers',
        schema: {
            example: {
                data: [{
                    id: '0f8d572d-93ff-4be0-8e71-0fa7fcfc5257',
                    answer_text: 'Type narrowing lets TypeScript reduce a union to a more specific type based on checks like typeof, in, equality checks, or custom type guards.',
                    ai_score: 9,
                    ai_feedback: {
                        strengths: 'Clear explanation of how type narrowing works with practical examples of guards.',
                        weaknesses: 'Could mention discriminated unions explicitly.',
                        accuracy: 'Technically accurate and aligned with the expected answer.'
                    },
                    ai_advice: 'Add one short example using a discriminated union to make the answer even stronger.',
                    status: 'success',
                    evaluated_at: '2026-04-20T14:12:59.097Z',
                }],
                total: 12,
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
        schema: {
            example: {
                id: '0f8d572d-93ff-4be0-8e71-0fa7fcfc5257',
                answer_text: 'Type narrowing lets TypeScript reduce a union to a more specific type based on checks like typeof, in, equality checks, or custom type guards.',
                ai_score: 9,
                ai_feedback: {
                    strengths: 'Clear explanation of how type narrowing works with practical examples of guards.',
                    weaknesses: 'Could mention discriminated unions explicitly.',
                    accuracy: 'Technically accurate and aligned with the expected answer.'
                },
                ai_advice: 'Add one short example using a discriminated union to make the answer even stronger.',
                status: 'success',
                evaluated_at: '2026-04-20T14:12:59.097Z'
            }
        }
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
