export interface SubmissionCount {
  difficulty: string;
  count: number;
  submissions: number;
}

export interface Submission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  __typename: string;
}

export interface LeetcodeUserData {
  totalSolved: number;
  totalSubmissions: SubmissionCount[];
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  contributionPoint: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: Submission[];
  matchedUserStats: {
    acSubmissionNum: SubmissionCount[];
    totalSubmissionNum: SubmissionCount[];
  };
} 