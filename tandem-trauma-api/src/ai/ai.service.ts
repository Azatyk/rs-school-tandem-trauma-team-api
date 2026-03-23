import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
    private model: GenerativeModel;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async evaluateAnswer(question: string, goldenAnswer: string, userAnswer: string) {

        const prompt = `
            You are an expert technical interviewer.
            Evaluate the following answer:

            Question: ${question}
            Golden Answer: ${goldenAnswer}
            User Answer: ${userAnswer}

            Respond ONLY with valid JSON, no markdown, no extra text:
            {
            "score": (number between 0 and 10, one decimal allowed),
            "feedback": {
                "strengths": "...",
                "weaknesses": "...",
                "accuracy": "..."
            },
            "advice": "..."
            }`

        const result = await this.model.generateContent(prompt);

        try {
            const text = result.response.text();
            return JSON.parse(text);
        } catch (error) {
            throw new Error('AI returned invalid response format');
        }
    }

}