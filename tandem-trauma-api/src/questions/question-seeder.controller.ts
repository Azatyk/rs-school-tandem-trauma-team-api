import { Controller, Post, Query } from '@nestjs/common';
import { QuestionSeederService } from './question-seeder.service';

@Controller('seed')
export class QuestionSeederController {
  constructor(private readonly questionSeederService: QuestionSeederService) {}

  @Post('frontend-questions')
  async seedFrontendQuestions(@Query('perTopic') perTopic?: string) {
    const questionsPerTopic = Number(perTopic) > 0 ? Number(perTopic) : 5;

    return this.questionSeederService.generateAndSaveFrontendQuestions(
      questionsPerTopic,
    );
  }
}
