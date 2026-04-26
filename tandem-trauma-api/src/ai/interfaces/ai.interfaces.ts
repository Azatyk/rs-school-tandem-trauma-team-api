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

export type RubricCriterion = {
  criterion: string;
  passed: boolean;
  comment: string;
};

export type EvaluateAnswerResult = {
  score: number;
  feedback: EvaluationFeedback;
  advice: string;
  rubrics: RubricCriterion[];
};

export type GeneratedCodingTask = {
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  testCases: {
    input: string;
    expected: string;
    description: string;
  }[];
  difficulty: 'easy' | 'medium' | 'hard';
};

export type GenerateCodingTasksResult = {
  topic: string;
  tasks: GeneratedCodingTask[];
};
