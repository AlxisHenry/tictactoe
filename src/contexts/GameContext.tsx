import { createContext, JSX } from "preact";
import { useState } from "preact/hooks";
import Swal from "sweetalert2";
import {
  type Game,
  type Player,
  type GameHistoryRound,
  GameMode,
  Choice,
} from "../types";

type GameContextType = Game & {
  isPlaying: boolean;
  setPlayers: (players: Player[]) => void;
  setMode: (mode: GameMode) => void;
  pushToHistory: (history: GameHistoryRound) => void;
  start: (
    mode: GameMode,
    player1: Player | null,
    player2: Player | null | undefined,
  ) => void;
};

export const GameContext = createContext<GameContextType>({
  isPlaying: false,
  players: [],
  mode: GameMode.Player,
  history: [],
  setPlayers: () => {},
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [mode, setMode] = useState<GameMode>(GameMode.Player);
  const [history, setHistory] = useState<GameHistoryRound[]>([]);

  const pushToHistory = (history: GameHistoryRound) => {
    setHistory((prev) => [...prev, history]);
  };

  const start = (
    mode: GameMode,
    player1: Player | null,
    player2?: Player | null,
  ): void => {
    if (!player1 || (mode === GameMode.Player && !player2)) {
      Swal.fire({
        title: "Erreur",
        text: "Veuillez renseigner les noms des joueurs",
        icon: "error",
      });
      return;
    }

    setPlayers([
      player1,
      player2 && mode !== GameMode.AI
        ? player2
        : {
            name: "IA",
            score: 0,
            symbol: Choice.O,
            isAI: true,
            wins: 0,
          },
    ]);
    setMode(mode);
    setIsPlaying(true);
  };

  return (
    <GameContext.Provider
      value={{
        isPlaying,
        players,
        setPlayers,
        mode,
        setMode,
        history,
        pushToHistory,
        start,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};