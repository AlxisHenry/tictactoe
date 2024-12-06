import { createContext, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import Swal from "sweetalert2";
import { useGame } from "../hooks";
import { Board, Choice, GameMode, Player, type Round } from "../types";
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
};

const defaultPlayer: Player = {
  name: "",
  score: 0,
  symbol: Choice.O,
  isAI: false,
  wins: 0,
};

export const RoundContext = createContext<RoundContextType>({
  timer: 0,
  board: [],
  play: () => {},
  currentPlayer: defaultPlayer,
  winner: null,
  setCurrentPlayer: () => {},
  winnerCheck: () => {},
});

interface RoundProviderProps {
  children: JSX.Element;
}

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

export const RoundProvider = (props: RoundProviderProps): JSX.Element => {
  const { children } = props;

  const { players, mode, pushToHistory } = useGame();

  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [winner, setWinner] = useState<Player | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(defaultPlayer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (players.length === 0) return;
    setCurrentPlayer(Math.random() < 0.5 ? players[0] : players[1]);
  }, [players]);

  useEffect(() => {
    if (mode !== GameMode.AI || currentPlayer.isAI === false) return;

    const moov = getBestMove(board);

    if (!moov) return;

    play(moov.x, moov.y);
  }, [currentPlayer]);

  const finish = (winner: Player | null) => {
    pushToHistory({ board, winner, timer });
    setWinner(winner);
    setBoard(createEmptyBoard());
    setTimer(0);
  };

  const play = (x: number, y: number) => {
    if (board[x][y]) return;

    setBoard((prev) => {
      const __board = [...prev];
      __board[x][y] = currentPlayer.symbol;
      return __board;
    });
    setCurrentPlayer(getOpponent(players, currentPlayer.symbol));
    winnerCheck();
  };

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
  };

  return (
    <RoundContext.Provider
      value={{
        timer,
        board,
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
