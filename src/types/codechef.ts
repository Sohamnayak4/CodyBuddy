export interface CodeChefHeatMapEntry {
  date: string;
  value: number;
}

export interface CodeChefRatingData {
  code: string;
  getyear: string;
  getmonth: string;
  getday: string;
  reason: string | null;
  penalised_in: string | null;
  rating: string;
  rank: string;
  name: string;
  end_date: string;
  color: string;
}

export interface CodeChefUserData {
  success: boolean;
  status: number;
  profile: string;
  name: string;
  currentRating: number;
  highestRating: number;
  countryFlag: string;
  countryName: string;
  globalRank: number;
  countryRank: number;
  stars: string;
  heatMap: CodeChefHeatMapEntry[];
  ratingData: CodeChefRatingData[];
} 