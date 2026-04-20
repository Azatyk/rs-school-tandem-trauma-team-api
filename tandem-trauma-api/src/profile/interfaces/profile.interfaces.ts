export type ProfileSolvedBreakdown = {
  easy: number;
  medium: number;
  hard: number;
};

export type ProfileStats = {
  currentStreak: number;
  longestStreak: number;
  totalSolvedTasks: number;
};

export type ProfileResponse = {
  name: string;
  email: string;
  memberSince: string;
  xp: number;
  stats: ProfileStats;
  difficultyBreakdown: ProfileSolvedBreakdown;
  topicMastery: Record<string, number>;
};
