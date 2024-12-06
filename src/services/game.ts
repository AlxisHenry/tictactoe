import { type Board, Choice, type Player } from "../types";

export const BOARD_SIZE = 3;
export const size = Array.from({ length: BOARD_SIZE });

export const createEmptyBoard = (): Board => {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));
};

export const getPlayer = (players: Player[], symbol: Choice) => {
  return players.find((player) => player.symbol === symbol) as Player;
};

export const getOpponent = (players: Player[], symbol: Choice) => {
  return players.find((player) => player.symbol !== symbol) as Player;
};

export const getWinner = (board: Board): Choice | null => {
  let winner = null;

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      winner = board[i][0];
    }

    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      winner = board[0][i];
    }
  }

  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    winner = board[0][0];
  }

  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    winner = board[0][2];
  }

  return winner;
};
