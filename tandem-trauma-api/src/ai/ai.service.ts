import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  GenerateQuestionsResult,
  TopicInput,
} from './interfaces/ai.interfaces';

@Injectable()
export class AiService {
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({
      model:
        this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash',
    });
  }

  private extractJson(text: string): string {
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error(`No JSON object found in Gemini response: ${cleaned}`);
    }

    return cleaned.slice(start, end + 1);
  }

  async generateJsQuestions(
    topics: TopicInput[],
    questionsPerTopic = 5,
  ): Promise<GenerateQuestionsResult> {
    const prompt = `
You are a senior JavaScript interviewer.

Generate interview questions for each topic below.

Hard constraints:
- Exactly ${questionsPerTopic} questions per topic
- Questions must be JavaScript-only, not TypeScript
- Questions should be practical and test understanding, not trivia
- Avoid duplicates across all topics
- For each question, provide a short but strong golden answer
- goldenAnswer must not be empty

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "language": "JavaScript",
  "questionsPerTopic": ${questionsPerTopic},
  "topics": [
    {
      "topic": "<topic title>",
      "questions": [
        {
          "question": "<text>",
          "goldenAnswer": "<expected strong answer>",
          "tags": ["..."]
        }
      ]
    }
  ]
}

Topics:
${JSON.stringify(topics, null, 2)}
`;

    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = result.response.text();

    try {
      const parsed = JSON.parse(
        this.extractJson(text),
      ) as GenerateQuestionsResult;

      if (parsed.language !== 'JavaScript' || !Array.isArray(parsed.topics)) {
        throw new Error('Unexpected JSON shape from Gemini');
      }

      return parsed;
    } catch {
      throw new Error(
        `AI returned invalid JSON for question generation. Raw response: ${text}`,
      );
    }
  }

  async evaluateAnswer(
    question: string,
    goldenAnswer: string,
    userAnswer: string,
  ) {
    const prompt = `
You are an expert technical interviewer.
Evaluate the following answer:

Question: ${question}
Golden Answer: ${goldenAnswer}
User Answer: ${userAnswer}

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "score": 0,
  "feedback": {
    "strengths": "...",
    "weaknesses": "...",
    "accuracy": "..."
  },
  "advice": "..."
}
`;

    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    try {
      const text = result.response.text();
      return JSON.parse(this.extractJson(text));
    } catch {
      throw new Error('AI returned invalid response format');
    }
  }
}
