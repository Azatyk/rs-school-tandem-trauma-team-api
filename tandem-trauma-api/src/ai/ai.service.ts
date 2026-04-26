import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import {
  EvaluateAnswerResult,
  GenerateQuestionsResult,
  TopicInput,
} from './interfaces/ai.interfaces';

@Injectable()
export class AiService {
  private client: Groq;
  private model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not defined in environment variables');
    }

    this.client = new Groq({
      apiKey,
    });

    this.model =
      this.configService.get<string>('GROQ_MODEL') || 'openai/gpt-oss-20b';
  }

  private parseJsonResponse<T>(content: string | null | undefined): T {
    if (!content) {
      throw new Error('AI returned an empty response');
    }

    return JSON.parse(content) as T;
  }

  async generateHint(
    question: string,
    level: 1 | 2 | 3,
  ): Promise<{ hint: string }> {
    const levelPrompts = {
      1: 'Give a guiding question that helps the user think in the right direction. Do NOT reveal the answer.',
      2: 'Give a partial direction pointing to the key concept. Do NOT reveal the full answer.',
      3: 'Give a near-answer hint that strongly guides the user without giving the full answer.',
    };

    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful mentor. Give hints to guide the user without revealing the answer directly.',
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nHint level ${level}: ${levelPrompts[level]}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'generate_hint',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              hint: { type: 'string' },
            },
            required: ['hint'],
            additionalProperties: false,
          },
        },
      },
    });

    const text = completion.choices[0]?.message?.content;
    return this.parseJsonResponse<{ hint: string }>(text);
  }

  async generateFrontendQuestions(
    topics: TopicInput[],
  questionsPerTopic = 5,
  ): Promise<GenerateQuestionsResult> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior frontend interviewer. Generate practical interview questions and concise golden answers covering JavaScript, TypeScript, frontend frameworks, browser fundamentals, and real frontend engineering work. Return only schema-compliant structured output.',
        },
        {
          role: 'user',
          content: `Generate interview questions for each topic below.

Hard constraints:
- Exactly ${questionsPerTopic} questions per topic
- Questions must be related to frontend development
- Cover JavaScript, TypeScript, frontend frameworks, browser APIs, rendering, state management, performance, testing, accessibility, and frontend architecture where relevant to the topic
- Questions should be practical and test understanding, not trivia
- Avoid duplicates across all topics
- For each question, provide a short but strong golden answer
- goldenAnswer must not be empty

Topics:
${JSON.stringify(topics, null, 2)}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'generate_js_questions',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
              },
              questionsPerTopic: {
                type: 'integer',
              },
              topics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    topic: {
                      type: 'string',
                    },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          question: {
                            type: 'string',
                          },
                          goldenAnswer: {
                            type: 'string',
                          },
                        },
                        required: ['question', 'goldenAnswer'],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ['topic', 'questions'],
                  additionalProperties: false,
                },
              },
            },
            required: ['language', 'questionsPerTopic', 'topics'],
            additionalProperties: false,
          },
        },
      },
    });

    const text = completion.choices[0]?.message?.content;

    try {
      const parsed = this.parseJsonResponse<GenerateQuestionsResult>(text);

      if (!parsed.language || !Array.isArray(parsed.topics)) {
        throw new Error('Unexpected JSON shape from AI provider');
      }

      return parsed;
    } catch {
      throw new Error(
        `AI returned invalid JSON for question generation. Raw response: ${text}`,
      );
    }
  }

  async explainCodingError(
    taskTitle: string,
    taskDescription: string,
    userCode: string,
    error: string,
  ): Promise<{ explanation: string; suggestion: string }> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are a senior coding mentor. Explain errors in simple human language and suggest fixes.',
        },
        {
          role: 'user',
          content: `Task: ${taskTitle}\nDescription: ${taskDescription}\n\nUser code:\n${userCode}\n\nError:\n${error}\n\nExplain the error in simple terms and suggest how to fix it.`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'explain_error',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              explanation: { type: 'string' },
              suggestion: { type: 'string' },
            },
            required: ['explanation', 'suggestion'],
            additionalProperties: false,
          },
        },
      },
    });

    const text = completion.choices[0]?.message?.content;
    return this.parseJsonResponse<{ explanation: string; suggestion: string }>(text);
  }

  async evaluateAnswer(
    question: string,
    goldenAnswer: string,
    userAnswer: string,
  ): Promise<EvaluateAnswerResult> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer. Evaluate answers fairly, accurately, and return only schema-compliant structured output. Always include rubric criteria relevant to the question.',
        },
        {
          role: 'user',
          content: `Evaluate the following answer:

Question: ${question}
Golden Answer: ${goldenAnswer}
User Answer: ${userAnswer}

Scoring rules:
- Return an integer score from 0 to 10
- 10 means the answer is excellent, fully correct, complete, and clearly explained
- 8-9 means strong answer with only small omissions
- 6-7 means mostly correct but missing important details
- 3-5 means partially correct, shallow, or noticeably incomplete
- 1-2 means largely incorrect
- 0 means empty, irrelevant, or completely wrong
- If the answer is described as excellent, perfect, exceptionally accurate, or having no significant weaknesses, the score should be 9 or 10, not 5

Also evaluate against these rubric criteria relevant to the question:
- Correctness: Is the core concept correct?
- Completeness: Are all important aspects covered?
- Clarity: Is the explanation clear and well-structured?
- Examples: Does the answer include relevant examples?
- Depth: Does the answer show deep understanding?`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'evaluate_answer',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              score: {
                type: 'integer',
                minimum: 0,
                maximum: 10,
              },
              feedback: {
                type: 'object',
                properties: {
                  strengths: {
                    type: 'string',
                  },
                  weaknesses: {
                    type: 'string',
                  },
                  accuracy: {
                    type: 'string',
                  },
                },
                required: ['strengths', 'weaknesses', 'accuracy'],
                additionalProperties: false,
              },
              advice: {
                type: 'string',
              },
              rubrics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    criterion: { type: 'string' },
                    passed: { type: 'boolean' },
                    comment: { type: 'string' },
                  },
                  required: ['criterion', 'passed', 'comment'],
                  additionalProperties: false,
                },
              },
            },
            required: ['score', 'feedback', 'advice', 'rubrics'],
            additionalProperties: false,
          },
        },
      },
    });

    try {
      const text = completion.choices[0]?.message?.content;
      const parsed = this.parseJsonResponse<EvaluateAnswerResult>(text);

      if (!Number.isInteger(parsed.score) || parsed.score < 0 || parsed.score > 10) {
        throw new Error('Score must be an integer from 0 to 10');
      }

      return parsed;
    } catch {
      throw new Error('AI returned invalid response format');
    }
  }
}
