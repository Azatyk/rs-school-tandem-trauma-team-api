import { Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodingTaskSeederService } from './coding-task-seeder.service';

@ApiTags('seed')
@Controller('seed')
export class CodingTaskSeederController {
  constructor(private readonly seederService: CodingTaskSeederService) {}

  @Post('coding-tasks')
  @ApiOperation({ summary: 'Seed coding tasks for all topics using AI' })
  async seedCodingTasks(@Query('perTopic') perTopic?: string) {
    const tasksPerTopic = Number(perTopic) > 0 ? Number(perTopic) : 3;
    return this.seederService.seedCodingTasks(tasksPerTopic);
  }
}