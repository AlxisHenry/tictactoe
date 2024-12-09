import { createContext, JSX } from "preact";
import { useState } from "preact/hooks";
import Swal from "sweetalert2";
import {
  type Game,
  type Player,
  type GameHistoryRound,
  type GameHistoryBeforeSave,
  GameMode,
} from "../types";

type GameContextType = Game & {
  isPlaying: boolean;
  setMode: (mode: GameMode) => void;
  pushToHistory: (history: GameHistoryBeforeSave) => void;
  start: (
    mode: GameMode,
    player1: Player | null,
    player2: Player | null,
  ) => void;
};

export const GameContext = createContext<GameContextType>({
  isPlaying: false,
  players: [],
  player1: null,
  player2: null,
  mode: GameMode.Player,
  history: [],
  setMode: () => {},
  pushToHistory: () => {},
  start: () => {},
});

interface GameProviderProps {
  children: JSX.Element;
}

export const GameProvider = (props: GameProviderProps): JSX.Element => {
  const { children } = props;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [mode, setMode] = useState<GameMode>(GameMode.Player);
  const [history, setHistory] = useState<GameHistoryRound[]>([]);

  const pushToHistory = (h: GameHistoryBeforeSave) => {
    setHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...h,
      },
    ]);
  };

  const start = (
    mode: GameMode,
    player1: Player | null,
    player2: Player | null,
  ): void => {
    if (!player1 || !player2) {
      Swal.fire({
        title: "Erreur",
        text: "Veuillez renseigner les noms des joueurs",
        icon: "error",
      });
      return;
    }

    setPlayer1(player1);
    setPlayer2(player2);
    setPlayers([player1, player2]);
    setMode(mode);
    setIsPlaying(true);
  };

  return (
    <GameContext.Provider
      value={{
        isPlaying,
        mode,
        setMode,
        history,
        pushToHistory,
        start,
        players,
        player1,
        player2,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
