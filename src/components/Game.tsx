import { JSX } from "preact/jsx-runtime";
import clsx from "clsx";
import { Choice, type Moov, type Board, Player } from "../types";
import { useGame, useRound } from "../hooks";
import { RoundProvider } from "../contexts";
import { size } from "../services/game";
import { Container } from "../components";
import { useState } from "preact/hooks";

export const Game = (): JSX.Element => {
  return (
    <RoundProvider>
      <Container>
        <History />
        <Header />
        <Board />
      </Container>
    </RoundProvider>
  );
};

const History = (): JSX.Element => {
  const { history } = useGame();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="absolute top-0 right-0 p-2 bg-purple-500/20 rounded-md shadow-md text-white font-semibold transition-colors hover:bg-purple-500/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        Historique
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative z-60 bg-white/5 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/30 max-h-96 w-100 overflow-y-auto scale-95 opacity-0 animate-slideIn">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Parties terminées
            </h2>
            <ul className="space-y-3">
              {history.map((game, index) => (
                <li
                  key={index}
                  className="flex flex-col p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-sm text-gray-300"></span>
                  <span className="text-xs text-gray-400">
                    Durée : {game.timer}
                  </span>
                  <SmallBoard />
                </li>
              ))}
            </ul>

            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Header = (): JSX.Element => {
  const { player1, player2 } = useGame();
  const { timer } = useRound();

  return (
    <div className="relative mb-14 p-4 rounded-lg flex justify-between items-center bg-white/5 backdrop-blur-lg shadow-lg border border-white/20">
      <HeaderPlayer player={player1} />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center w-24 h-24 bg-white/10 rounded-full shadow-md backdrop-blur-md border border-white/30">
          <div className="absolute w-full h-full animate-spin-slow bg-gradient-to-r from-purple-500 to-purple-500 rounded-full blur-md opacity-10"></div>
          <span className="text-white font-bold text-2xl">
            {formatTimerInMinutes(timer)}
          </span>
        </div>
      </div>

      <HeaderPlayer player={player2} />
    </div>
  );
};

const HeaderPlayer = ({ player }: { player: Player | null }): JSX.Element => {
  const { currentPlayer } = useRound();

  if (!player) {
    return (
      <div className="flex items-center min-w-0">
        <div className="w-6 h-6 rounded-full mr-3 bg-gray-200"></div>
        <div className="flex flex-col">
          <span className="text-white text-lg font-semibold truncate">
            En attente...
          </span>
        </div>
      </div>
    );
  }

  const isTurn = currentPlayer.name === player.name;

  return (
    <div
      className={`flex items-center min-w-0 ${isTurn ? "opacity-100" : "opacity-60"} transition-opacity`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-blue-300 w-6 h-6 rounded-full mr-3 shadow-md"></div>
      <div className="flex flex-col">
        <span className="text-white text-lg font-semibold truncate">
          {player.name}
          {player.isAI ? ` (${player?.difficulty})` : ""}
        </span>
        <span className="text-sm text-gray-200 font-medium">
          Score: {player.wins}
        </span>
      </div>
    </div>
  );
};

const formatTimerInMinutes = (timer: number): string => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const Board = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center mt-6">
      <div className="grid grid-cols-3 gap-4 p-8 bg-white/5 backdrop-blur-lg shadow-md rounded-lg border border-white/10">
        {size.map((_, x) =>
          size.map((_, y) => <Cell key={`${x}-${y}`} coordinates={{ x, y }} />),
        )}
      </div>
    </div>
  );
};

interface CellProps {
  coordinates: Moov;
}

const Cell = (props: CellProps): JSX.Element => {
  const { coordinates } = props;
  const { board, currentPlayer, play } = useRound();

  const { x, y } = coordinates;
  const choice = board[x][y];

  return (
    <div
      onClick={() => {
        if (currentPlayer.isAI) return;

        play(x, y);
      }}
      data-coordinates={`${coordinates.x}-${coordinates.y}`}
      className={clsx(
        "w-48 h-48 rounded-md flex items-center justify-center text-4xl font-bold cursor-pointer transition-transform",
        {
          "bg-purple-600 text-white shadow-md border-2 border-purple-500":
            choice === Choice.X,
          "bg-purple-500 text-white shadow-md border-2 border-purple-400":
            choice === Choice.O,
          "bg-white/5 text-gray-400 hover:bg-gray-50/20 hover:text-gray-700 border-2 border-white/20":
            !choice,
          "hover:scale-105": !choice,
        },
      )}
    >
      {choice}
    </div>
  );
};

const SmallBoard = (): JSX.Element => {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-white/5 backdrop-blur-lg shadow-md rounded-lg border border-white/10">
      {size.map((_, x) =>
        size.map((_, y) => <SmallCell key={`${x}-${y}`} coordinates={{ x, y }} />),
      )}
    </div>
  );
}

interface SmallCellProps {
  coordinates: Moov;
}

const SmallCell = (props: SmallCellProps): JSX.Element => {
  const { coordinates } = props;
  const { board, currentPlayer, play } = useRound();

  const { x, y } = coordinates;
  const choice = board[x][y];

  return (
    <div
      onClick={() => {
        if (currentPlayer.isAI) return;

        play(x, y);
      }}
      data-coordinates={`${coordinates.x}-${coordinates.y}`}
      className={clsx(
        "w-16 h-16 rounded-md flex items-center justify-center text-2xl font-bold cursor-pointer transition-transform",
        {
          "bg-purple-600 text-white shadow-md border-2 border-purple-500":
            choice === Choice.X,
          "bg-purple-500 text-white shadow-md border-2 border-purple-400":
            choice === Choice.O,
          "bg-white/5 text-gray-400 hover:bg-gray-50/20 hover:text-gray-700 border-2 border-white/20":
            !choice,
          "hover:scale-105": !choice,
        },
      )}
    >
      {choice}
    </div>
  );
};
