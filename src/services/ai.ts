import { type Player, type Board, type Move, Difficulty } from "../types";
import { BOARD_SIZE, getOpponent, getWinner } from "./game";

interface Simulation {
  move: Move;
  tries: number;
  score: number;
  average: number;
}

const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

const getRandomMove = (availableMoves: Move[]): Move =>
  availableMoves[Math.floor(Math.random() * availableMoves.length)];

const playRandomGame = (
  players: Player[],
  board: Board,
  currentPlayer: Player,
): number => {
  let availableMoves = getAvailableMoves(board);

  while (availableMoves.length > 0) {
    const move = getRandomMove(availableMoves);
    board[move.x][move.y] = currentPlayer.symbol;

    const winner = getWinner(board);
    if (winner) {
      return winner === currentPlayer.symbol ? 1 : -1;
    }

    currentPlayer = getOpponent(players, currentPlayer.symbol);

    availableMoves = getAvailableMoves(board);
  }

  return 0;
};

export const simulateGameWithMove = (
  players: Player[],
  currentPlayer: Player,
  board: Board,
  move: Move,
): Simulation => {
  const tries = getAvailableMoves(board).length;
  let totalScore = 0;

  const clonedBoard = cloneBoard(board);

  clonedBoard[move.x][move.y] = currentPlayer.symbol;

  for (let i = 0; i < tries; i++) {
    const simulationBoard = cloneBoard(clonedBoard);
    const score = playRandomGame(players, simulationBoard, currentPlayer);
    totalScore += score;
  }

  return {
    tries: tries,
    score: totalScore,
    average: (totalScore / tries) * 100,
    move,
  };
};

export const getAvailableMoves = (grid: Board): Move[] => {
  const availableMoves: Move[] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!grid[i][j]) {
        availableMoves.push({ x: i, y: j });
      }
    }
  }

  return availableMoves;
};

interface SimulatedMove {
  move: Move;
  simulation: Simulation;
}

const chooseMoveDependingOnDifficulty = (
  difficulty: Difficulty,
  simulatedMoves: SimulatedMove[],
): Move => {
  if (difficulty === Difficulty.Easy) {
    return simulatedMoves[0].move;
  }

  if (difficulty === Difficulty.Medium) {
    return simulatedMoves[Math.floor(simulatedMoves.length / 2)].move;
  }

  return simulatedMoves[simulatedMoves.length - 1].move;
};

export const getBestMove = (
  players: Player[],
  currentPlayer: Player,
  board: Board,
): Move | null => {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return null;

  const simulatedMoves: SimulatedMove[] = availableMoves
    .map((move) => {
      return {
        move,
        simulation: simulateGameWithMove(players, currentPlayer, board, move),
      };
    })
    .sort((a, b) => b.simulation.average - a.simulation.average);

  return chooseMoveDependingOnDifficulty(
    currentPlayer?.difficulty || Difficulty.Easy,
    simulatedMoves,
  );
};
