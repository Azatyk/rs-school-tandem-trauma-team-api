export type TopicInput = {
  title: string;
  description?: string;
};

export type GeneratedQuestion = {
  question: string;
  goldenAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
};

export type GeneratedTopic = {
  topic: string;
  questions: GeneratedQuestion[];
};

export type GenerateQuestionsResult = {
  language: string;
  questionsPerTopic: number;
  topics: GeneratedTopic[];
};

export type EvaluationFeedback = {
  strengths: string;
  weaknesses: string;
  accuracy: string;
};

export type EvaluateAnswerResult = {
  score: number;
  feedback: EvaluationFeedback;
  advice: string;
};
