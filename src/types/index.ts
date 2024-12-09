export enum Choice {
  X = "X",
  O = "O",
}

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export type Cell = Choice | null;

export type Board = Cell[][];

export type Player = {
  name: string;
  score: number;
  symbol: Choice;
  isAI: boolean;
  wins: number;
  difficulty?: Difficulty;
};

export type Moov = {
  x: number;
  y: number;
};

export type Form = {
  player1: Player | null;
  player2?: Player | null;
  mode: GameMode;
};

export enum GameMode {
  Player = "player",
  AI = "ai",
}

export type Round = {
  timer: number;
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
};

export type GameHistoryRound = {
  id: number;
  duration: number;
  board: Board;
  winner: Player | null;
};

export type GameHistoryBeforeSave = {
  board: Board;
  winner: Player | null;
  timer: number;
};

export type Game = {
  players: Player[];
  player1: Player | null;
  player2: Player | null;
  mode: GameMode;
  history: GameHistoryRound[];
};
