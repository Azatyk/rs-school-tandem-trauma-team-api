import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CodingTasksService } from './coding-tasks.service';
import { CreateCodingTaskDto } from './dto/create-coding-task.dto';
import { GetCodingTasksDto } from './dto/get-coding-tasks.dto';
import { ExplainErrorDto } from './dto/explain-error.dto';
import { SubmitCodingTaskDto } from './dto/submit-coding-task.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('coding-tasks')
@Controller('coding-tasks')
@UseGuards(JwtAuthGuard)
export class CodingTasksController {
  constructor(private readonly codingTasksService: CodingTasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coding tasks' })
  findAll(@Query() dto: GetCodingTasksDto) {
    return this.codingTasksService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one coding task' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.codingTasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a coding task' })
  @ApiBody({ type: CreateCodingTaskDto })
  create(@Body() dto: CreateCodingTaskDto) {
    return this.codingTasksService.create(dto);
  }

  @Post(':id/explain-error')
  @ApiOperation({ summary: 'Explain a coding error using AI' })
  @ApiBody({ type: ExplainErrorDto })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        explanation: 'You have a typo in reduce — you wrote reduc instead of reduce.',
        suggestion: 'Change arr.reduc to arr.reduce to fix the error.',
      },
    },
  })
  explainError(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ExplainErrorDto,
  ) {
    return this.codingTasksService.explainError(id, dto.error, dto.user_code);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit coding task result and earn XP' })
  @ApiBody({ type: SubmitCodingTaskDto })
  @ApiResponse({
   status: 201,
   schema: {
     example: {
       xpEarned: 20,
       message: 'Task passed! You earned 20 XP.',
     },
   },
 })
 submit(
   @Param('id', ParseUUIDPipe) id: string,
   @Body() dto: SubmitCodingTaskDto,
   @CurrentUser('userId') userId: string,
 ) {
   return this.codingTasksService.submit(id, dto, userId);
 }
}