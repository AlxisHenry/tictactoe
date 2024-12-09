export enum Choice {
  X = "X",
  O = "O",
}

export enum Difficulty {
  Easy = "Facile",
  Medium = "Moyen",
  Hard = "Difficile",
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
  player2: Player | null;
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
  duration: number;
};

export type Game = {
  players: Player[];
  player1: Player | null;
  player2: Player | null;
  mode: GameMode;
  history: GameHistoryRound[];
};

export const defaultPlayer: Player = {
  name: "",
  score: 0,
  symbol: Choice.X,
  isAI: false,
  wins: 0,
};

export const defaultAI = {
  name: "IA",
  score: 0,
  symbol: Choice.O,
  isAI: true,
  wins: 0,
};