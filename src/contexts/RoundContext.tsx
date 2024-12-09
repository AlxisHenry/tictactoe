import { createContext, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import Swal from "sweetalert2";
import { useGame } from "../hooks";
import { Board, defaultPlayer, GameMode, Player, type Round } from "../types";
import {
  BOARD_SIZE,
  getOpponent,
  getPlayer,
  getWinner,
} from "../services/game";
import { getBestMove } from "../services/ai";

type RoundContextType = Round & {
  setCurrentPlayer: (player: Player) => void;
  play: (x: number, y: number) => void;
  winnerCheck: () => void;
  increaseTimer: () => void;
};

export const RoundContext = createContext<RoundContextType>({
  timer: 0,
  board: [],
  play: () => {},
  currentPlayer: defaultPlayer,
  winner: null,
  setCurrentPlayer: () => {},
  winnerCheck: () => {},
  increaseTimer: () => {},
});

interface RoundProviderProps {
  children: JSX.Element;
}

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

export const RoundProvider = (props: RoundProviderProps): JSX.Element => {
  const { children } = props;

  const { players, player1, player2, mode, pushToHistory } = useGame();

  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [winner, setWinner] = useState<Player | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(defaultPlayer);

  useEffect(() => {
    if (players.length === 0 || !player1 || !player2) return;
    setCurrentPlayer(Math.random() < 0.5 ? player1 : player2);
  }, [players]);

  useEffect(() => {
    if (mode !== GameMode.AI || currentPlayer.isAI === false) return;

    const moov = getBestMove(board);

    if (!moov) return;

    setTimeout(() => play(moov.x, moov.y), 500);
  }, [currentPlayer]);

  const finish = (winner: Player | null) => {
    if (players.length === 0 || !player1 || !player2) return;

    pushToHistory({ board, winner, duration: timer });
    setWinner(winner);
    setBoard(createEmptyBoard());
    setCurrentPlayer(Math.random() < 0.5 ? player1 : player2);
    setTimer(0);
  };

  const play = (x: number, y: number) => {
    if (board[x][y]) return;

    setBoard((prev) => {
      const __board = [...prev];
      __board[x][y] = currentPlayer.symbol;
      return __board;
    });

    winnerCheck();
  };

  const increaseTimer = () => setTimer((prev) => prev + 1);

  const winnerCheck = () => {
    const winner = getWinner(board);

    if (winner) {
      const player = getPlayer(players, winner);

      if (player) {
        player.wins++;

        Swal.fire({
          title: `Le vainqueur est ${player.name} !`,
          icon: "success",
          confirmButtonText: "Rejouer",
        }).then(() => finish(player));
      }
      return;
    }

    if (board.every((row) => row.every((cell) => cell))) {
      Swal.fire({
        title: "Match nul !",
        icon: "info",
        confirmButtonText: "Rejouer",
      }).then(() => finish(null));
      return;
    }

    setCurrentPlayer(getOpponent(players, currentPlayer.symbol));
  };

  return (
    <RoundContext.Provider
      value={{
        timer,
        board,
        increaseTimer,
        play,
        winner,
        winnerCheck,
        currentPlayer,
        setCurrentPlayer,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
