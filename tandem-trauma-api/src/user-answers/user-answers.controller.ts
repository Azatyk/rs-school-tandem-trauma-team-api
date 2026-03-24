import { CreateUserAnswerDto } from "./dto/create-user-answer.dto";
import { GetUserAnswersDto } from "./dto/get-user-answers.dto";
import { UserAnswersService } from "./user-answers.service";
import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('user-answers')
@Controller('user-answers')
export class UserAnswersController {
    constructor(private readonly userAnswersService: UserAnswersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all user answers' })
    findAll(@Query() dto: GetUserAnswersDto) {
        return this.userAnswersService.findAll(dto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one user answer' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.userAnswersService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create user answer' })
    create(@Body() dto: CreateUserAnswerDto) {
        return this.userAnswersService.create(dto)
    }
}