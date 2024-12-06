import { type Board, type Moov } from "../types";
import { BOARD_SIZE } from "./game";

export const getAvailableMoves = (grid: Board): Moov[] => {
  const availableMoves: Moov[] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!grid[i][j]) {
        availableMoves.push({ x: i, y: j });
      }
    }
  }

  return availableMoves;
};

export const getBestMove = (board: Board): Moov | null => {
  const availableMoves = getAvailableMoves(board);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};
