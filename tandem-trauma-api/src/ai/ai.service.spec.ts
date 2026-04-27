import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import type { TopicInput } from './interfaces/ai.interfaces';

const createCompletionMock = jest.fn();

jest.mock('groq-sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: createCompletionMock,
        },
      },
    })),
  };
});

function mockConfig(getImpl: (key: string) => string | undefined): Partial<ConfigService> {
  return {
    get: jest.fn((key: string) => getImpl(key)),
  };
}

describe('AiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if GROQ_API_KEY is missing', async () => {
    await expect(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AiService,
          { provide: ConfigService, useValue: mockConfig(() => undefined) },
        ],
      }).compile();

      module.get(AiService);
    }).rejects.toThrow('GROQ_API_KEY is not defined in environment variables');
  });

  it('generateHint should parse JSON response and call Groq with default model', async () => {
    createCompletionMock.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ hint: 'Try thinking about closures.' }) } }],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfig((key) => {
            if (key === 'GROQ_API_KEY') return 'test-key';
            return undefined;
          }),
        },
      ],
    }).compile();

    const service = module.get(AiService);
    const result = await service.generateHint('What is a closure?', 2);

    expect(result).toEqual({ hint: 'Try thinking about closures.' });
    expect(createCompletionMock).toHaveBeenCalledTimes(1);
    expect(createCompletionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'openai/gpt-oss-20b',
        response_format: expect.any(Object),
      }),
    );
  });

  it('generateHint should throw if AI returned empty response', async () => {
    createCompletionMock.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfig((key) => (key === 'GROQ_API_KEY' ? 'test-key' : undefined)),
        },
      ],
    }).compile();

    const service = module.get(AiService);

    await expect(service.generateHint('Any question', 1)).rejects.toThrow(
      'AI returned an empty response',
    );
  });

  it('generateFrontendQuestions should return parsed result when JSON is valid', async () => {
    const topics: TopicInput[] = [{ title: 'React', description: 'Hooks, rendering, state' }];

    const payload = {
      language: 'frontend',
      questionsPerTopic: 2,
      topics: [
        {
          topic: 'React',
          questions: [
            { question: 'What is reconciliation?', goldenAnswer: 'Diff virtual tree, update minimal DOM.' },
            { question: 'Why use useMemo?', goldenAnswer: 'Memoize expensive computations between renders.' },
          ],
        },
      ],
    };

    createCompletionMock.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(payload) } }],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfig((key) => (key === 'GROQ_API_KEY' ? 'test-key' : undefined)),
        },
      ],
    }).compile();

    const service = module.get(AiService);
    const result = await service.generateFrontendQuestions(topics, 2);

    expect(result).toEqual(payload);
  });

  it('generateFrontendQuestions should throw with raw response if JSON is invalid', async () => {
    createCompletionMock.mockResolvedValue({
      choices: [{ message: { content: '{not-json' } }],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfig((key) => (key === 'GROQ_API_KEY' ? 'test-key' : undefined)),
        },
      ],
    }).compile();

    const service = module.get(AiService);
    await expect(service.generateFrontendQuestions([{ title: 'JS' }], 1)).rejects.toThrow(
      /AI returned invalid JSON for question generation\. Raw response: \{not-json/,
    );
  });

  it('evaluateAnswer should throw if score is out of range', async () => {
    createCompletionMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              score: 11,
              feedback: { strengths: 'x', weaknesses: 'y', accuracy: 'z' },
              advice: 'Do better',
              rubrics: [{ criterion: 'Correctness', passed: true, comment: 'ok' }],
            }),
          },
        },
      ],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfig((key) => (key === 'GROQ_API_KEY' ? 'test-key' : undefined)),
        },
      ],
    }).compile();

    const service = module.get(AiService);
    await expect(service.evaluateAnswer('Q', 'A', 'U')).rejects.toThrow(
      'AI returned invalid response format',
    );
  });
});

