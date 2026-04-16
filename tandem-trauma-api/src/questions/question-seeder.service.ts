import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AiService } from '../ai/ai.service';
import { Topic } from '../topics/entities/topic.entity';
import { Question } from './entities/question.entity';

const JS_TOPICS = [
  { title: 'Variables: var, let, const' },
  { title: 'Data types and type coercion' },
  { title: 'Functions and arrow functions' },
  { title: 'Arrays and basic array methods (map, filter, find)' },
  { title: 'Scope, hoisting, and closures' },
  { title: 'this keyword and context binding' },
  { title: 'Promises, async/await, and event loop basics' },
  { title: 'Prototypal inheritance and prototype chain' },
  { title: 'Debounce vs throttle, call stack, microtasks vs macrotasks' },
  { title: 'Memory leaks, shallow vs deep copy, and performance optimization' },
];

@Injectable()
export class QuestionSeederService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async generateAndSaveJsQuestions(questionsPerTopic = 5) {
    const generated = await this.aiService.generateJsQuestions(
      JS_TOPICS,
      questionsPerTopic,
    );

    for (const generatedTopic of generated.topics) {
      const topicTitle = String(generatedTopic.topic || '').trim();
      if (!topicTitle) continue;

      let topic = await this.topicRepository.findOne({
        where: { title: topicTitle },
      });

      if (!topic) {
        topic = this.topicRepository.create({
          title: topicTitle,
          description: null,
        });

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
          topic,
        });

        await this.questionRepository.save(question);
      }
    }

    return {
      success: true,
      language: generated.language,
      questionsPerTopic: generated.questionsPerTopic,
      topicsProcessed: generated.topics.length,
    };
  }
}
