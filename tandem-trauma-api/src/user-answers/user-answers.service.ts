import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { AnswerStatus, UserAnswer } from './entities/user-answer.entity';
import { AiService } from 'src/ai/ai.service';
import { GetUserAnswersDto } from './dto/get-user-answers.dto';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class UserAnswersService {
    constructor(
        @InjectRepository(UserAnswer)
        private readonly userAnswersRepository: Repository<UserAnswer>,
        private readonly questionsService: QuestionsService,
        private readonly aiService: AiService
    ) {}

    async findAll(dto: GetUserAnswersDto): Promise<{ data: UserAnswer[], total: number, page: number, limit: number }> {
        const { page = 1, limit = 10, userId, questionId, status } = dto;


        const [data, total] = await this.userAnswersRepository.findAndCount({
            where: {
                ...(questionId && { question: { id: questionId } }),
                ...(userId && { user: { id: userId } }),
                ...(status && { status }),
            },
            take: limit,
            skip: (page - 1) * limit,
        })

        return { data, total, page, limit };
    }

    async findOne(id: string) {

        const answer = await this.userAnswersRepository.findOne({ where: { id }})

        if (!answer) {
            throw new NotFoundException(`Answer with the ${id} not found`)
        }

        return answer;
    }

    async create(dto: CreateUserAnswerDto): Promise<UserAnswer> {

        const question = await this.questionsService.findOne(dto.questionId);

        const answer = this.userAnswersRepository.create({
            answer_text: dto.answerText,
            user: { id: dto.userId },
            question: { id: dto.questionId },
            status: AnswerStatus.PENDING
        });

        const savedAnswer = await this.userAnswersRepository.save(answer);
          try {
            const evaluation = await this.aiService.evaluateAnswer(
                question.theoretical_question,
                question.golden_answer,
                dto.answerText
            );
            savedAnswer.ai_score = evaluation.score;
            savedAnswer.ai_feedback = evaluation.feedback;
            savedAnswer.ai_advice = evaluation.advice;
            savedAnswer.status = AnswerStatus.SUCCESS;
            savedAnswer.evaluated_at = new Date();
        } catch (error) {
               console.error('AI parse error:', error);
               throw new Error('AI returned invalid response format');
        }

        return this.userAnswersRepository.save(savedAnswer);

    }

}