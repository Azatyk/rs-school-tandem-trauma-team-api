import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';

import {
  GenerateQuestionsResult,
  TopicInput,
} from '../ai/interfaces/ai.interfaces';
import { Topic } from '../topics/entities/topic.entity';
import { Question, QuestionDifficulty } from './entities/question.entity';

@Injectable()
export class QuestionSeederService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  private normalizeDifficulty(value: string | undefined): QuestionDifficulty {
    if (
      value === QuestionDifficulty.EASY ||
      value === QuestionDifficulty.MEDIUM ||
      value === QuestionDifficulty.HARD
    ) {
      return value;
    }

    throw new Error(
      'Question bank contains a question without a valid difficulty. Regenerate frontend-question-bank.json.',
    );
  }

  private getQuestionBankPath(): string {
    return join(
      process.cwd(),
      'src',
      'questions',
      'data',
      'frontend-question-bank.json',
    );
  }

  private getTopicsPath(): string {
    return join(
      process.cwd(),
      'src',
      'questions',
      'data',
      'frontend-topics.json',
    );
  }

  private async loadTopicsMetadata(): Promise<TopicInput[]> {
    const content = await readFile(this.getTopicsPath(), 'utf-8');
    const parsed = JSON.parse(content) as TopicInput[];

    return parsed.filter(
      (topic) => typeof topic?.title === 'string' && topic.title.trim(),
    );
  }

  private async loadQuestionBank(): Promise<GenerateQuestionsResult | null> {
    try {
      const content = await readFile(this.getQuestionBankPath(), 'utf-8');
      const parsed = JSON.parse(content) as GenerateQuestionsResult;

      if (!parsed.language || !Array.isArray(parsed.topics)) {
        return null;
      }

      const hasSeedableQuestions = parsed.topics.some(
        (topic) => Array.isArray(topic.questions) && topic.questions.length > 0,
      );

      if (!hasSeedableQuestions) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  async generateAndSaveFrontendQuestions(questionsPerTopic = 5) {
    const generated = await this.loadQuestionBank();
    const topicsMetadata = await this.loadTopicsMetadata();

    if (!generated) {
      throw new Error(
        'Question bank is missing or empty. Generate src/questions/data/frontend-question-bank.json before seeding.',
      );
    }

    for (const generatedTopic of generated.topics) {
      const topicTitle = String(generatedTopic.topic || '').trim();
      if (!topicTitle) continue;

      const topicMetadata = topicsMetadata.find(
        (topic) => topic.title.trim() === topicTitle,
      );
      const topicDescription = topicMetadata?.description?.trim() ?? null;

      let topic = await this.topicRepository.findOne({
        where: { title: topicTitle },
      });

      if (!topic) {
        topic = this.topicRepository.create({
          title: topicTitle,
          description: topicDescription,
        });

        topic = await this.topicRepository.save(topic);
      } else if (topic.description !== topicDescription) {
        topic.description = topicDescription;
        topic = await this.topicRepository.save(topic);
      }

      for (const generatedQuestion of generatedTopic.questions) {
        const questionText = String(generatedQuestion.question || '').trim();
        if (!questionText) continue;

        const existingQuestion = await this.questionRepository
          .createQueryBuilder('question')
          .leftJoin('question.topic', 'topic')
          .where('question.theoretical_question = :questionText', {
            questionText,
          })
          .andWhere('topic.id = :topicId', {
            topicId: topic.id,
          })
          .getOne();

        if (existingQuestion) {
          continue;
        }

        const question = this.questionRepository.create({
          theoretical_question: questionText,
          golden_answer: generatedQuestion.goldenAnswer,
          difficulty: this.normalizeDifficulty(generatedQuestion.difficulty),
          topic,
        });

        await this.questionRepository.save(question);
      }
    }

    return {
      success: true,
      language: generated.language,
      questionsPerTopic: questionsPerTopic || generated.questionsPerTopic,
      topicsProcessed: generated.topics.length,
    };
  }
}
