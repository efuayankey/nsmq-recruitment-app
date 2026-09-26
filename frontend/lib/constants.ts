import type { RoundType } from "./types";

export const ROUND_LABELS: Record<RoundType, string> = {
  general: "General Questions",
  speed_race: "Speed Race",
  problem_of_the_day: "Problem of the Day",
  true_false: "True / False",
  riddle: "Riddles",
};

export const ROUND_DESCRIPTIONS: Record<RoundType, string> = {
  general: "Mixed STEM questions at a moderate pace.",
  speed_race: "Short timer, fast transitions — test your recall speed.",
  problem_of_the_day: "One longer multi-step problem, more time to think.",
  true_false: "Binary calls with a points penalty for guessing wrong.",
  riddle: "Progressive clues — answer early for more points.",
};

export const ALL_ROUND_TYPES: RoundType[] = [
  "general",
  "speed_race",
  "problem_of_the_day",
  "true_false",
  "riddle",
];

export const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"];
