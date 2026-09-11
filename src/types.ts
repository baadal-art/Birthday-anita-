export type GameStage = 'lock' | 'cake' | 'quiz' | 'victory_gate' | 'final_wish';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  reaction: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctNote: string;
}
