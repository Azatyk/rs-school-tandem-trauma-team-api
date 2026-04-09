export type TopicInput = {
  title: string;
};

export type GeneratedQuestion = {
  question: string;
  goldenAnswer: string;
  tags?: string[];
};

export type GeneratedTopic = {
  topic: string;
  questions: GeneratedQuestion[];
};

export type GenerateQuestionsResult = {
  language: 'JavaScript';
  questionsPerTopic: number;
  topics: GeneratedTopic[];
};