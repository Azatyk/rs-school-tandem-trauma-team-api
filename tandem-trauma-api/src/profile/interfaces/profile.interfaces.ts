export type ProfileSolvedBreakdown = {
  easy: number;
  medium: number;
  hard: number;
};

export type ProfileStats = {
  currentStreak: number;
  longestStreak: number;
  totalSolvedTasks: number;
  xp: number;
};

export type ProfileResponse = {
  name: string;
  email: string;
  memberSince: string;
  stats: ProfileStats;
  difficultyBreakdown: ProfileSolvedBreakdown;
  topicMastery: Record<string, number>;
};
