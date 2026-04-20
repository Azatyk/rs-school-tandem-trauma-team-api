import 'dotenv/config';

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Groq from 'groq-sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const topicsPath = resolve(
  projectRoot,
  'src',
  'questions',
  'data',
  'frontend-topics.json',
);
const questionBankPath = resolve(
  projectRoot,
  'src',
  'questions',
  'data',
  'frontend-question-bank.json',
);

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL ?? 'openai/gpt-oss-20b';
const perTopic = Number(process.env.PER_TOPIC ?? '5');

if (!apiKey) {
  console.error('GROQ_API_KEY is not defined in environment variables.');
  process.exit(1);
}

const topics = JSON.parse(await readFile(topicsPath, 'utf-8'));

const client = new Groq({ apiKey });

const requestDelayMs = Number(process.env.GROQ_REQUEST_DELAY_MS ?? '1200');
const maxRetries = Number(process.env.GROQ_MAX_RETRIES ?? '3');
const difficultyPlan = [
  {
    difficulty: 'easy',
    count: Number.isFinite(Number(process.env.EASY_PER_TOPIC))
      ? Number(process.env.EASY_PER_TOPIC)
      : 5,
    guidance: 'Target junior-level fundamentals, direct API usage, and basic syntax understanding.',
  },
  {
    difficulty: 'medium',
    count: Number.isFinite(Number(process.env.MEDIUM_PER_TOPIC))
      ? Number(process.env.MEDIUM_PER_TOPIC)
      : 8,
    guidance:
      'Target intermediate frontend engineers with realistic scenarios, debugging, and applied reasoning.',
  },
  {
    difficulty: 'hard',
    count: Number.isFinite(Number(process.env.HARD_PER_TOPIC))
      ? Number(process.env.HARD_PER_TOPIC)
      : 4,
    guidance:
      'Target senior-level depth, edge cases, tradeoffs, architecture, and nuanced problem solving.',
  },
].filter((item) => Number.isFinite(item.count) && item.count > 0);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelay(error, attempt) {
  const retryAfter = Number(error?.headers?.['retry-after']);

  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }

  return requestDelayMs * Math.max(1, attempt + 1);
}

function isJsonValidationFailure(error) {
  return (
    error?.status === 400 &&
    error?.error?.error?.code === 'json_validate_failed'
  );
}

function describeError(error) {
  return (
    error?.error?.error?.message ||
    error?.message ||
    'Unknown Groq error'
  );
}

async function generateTopicQuestions(topic, difficultyConfig) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are a senior frontend interviewer. Generate practical interview questions and concise golden answers. Stay strictly inside the requested topic category and return only schema-compliant structured output.',
          },
          {
            role: 'user',
            content: `Generate interview questions for the following topic and difficulty.

Hard constraints:
- Exactly ${difficultyConfig.count} questions
- Difficulty must be ${difficultyConfig.difficulty}
- Questions must be related to frontend development
- Stay strictly within the requested topic title and description
- Do not drift into unrelated frontend categories
- Questions should be practical and test understanding, not trivia
- Questions in this topic should be distinct from each other
- ${difficultyConfig.guidance}
- For each question, provide a short but strong golden answer
- goldenAnswer must not be empty

Topic:
${JSON.stringify(topic, null, 2)}

Difficulty:
${difficultyConfig.difficulty}`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'generate_topic_questions',
            strict: true,
            schema: {
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
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error(
          `Groq returned an empty response for topic "${topic.title}" at difficulty "${difficultyConfig.difficulty}".`,
        );
      }

      const parsed = JSON.parse(content);

      return {
        topic: parsed.topic,
        questions: parsed.questions.map((question) => ({
          ...question,
          difficulty: difficultyConfig.difficulty,
        })),
      };
    } catch (error) {
      const isRateLimited = error?.status === 429;
      const isSchemaFailure = isJsonValidationFailure(error);
      const canRetry = isRateLimited || isSchemaFailure;

      if (!canRetry || attempt === maxRetries) {
        throw error;
      }

      console.warn(
        `[question-bank] retrying topic="${topic.title}" difficulty="${difficultyConfig.difficulty}" attempt=${attempt + 1}/${maxRetries} reason="${describeError(error)}"`,
      );

      await sleep(getRetryDelay(error, attempt));
    }
  }

  throw new Error(
    `Failed to generate questions for topic "${topic.title}" at difficulty "${difficultyConfig.difficulty}".`,
  );
}

const generatedTopics = [];

for (const topic of topics) {
  const questions = [];

  for (const difficultyConfig of difficultyPlan) {
    const generatedTopic = await generateTopicQuestions(topic, difficultyConfig);
    questions.push(...generatedTopic.questions);
    await sleep(requestDelayMs);
  }

  generatedTopics.push({
    topic: topic.title,
    questions,
  });
}

const parsed = {
  language: 'Frontend',
  questionsPerTopic: difficultyPlan.reduce((sum, item) => sum + item.count, 0),
  topics: generatedTopics,
};

await writeFile(questionBankPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf-8');

console.log(`Question bank written to ${questionBankPath}`);
