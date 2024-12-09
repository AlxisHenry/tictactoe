import { JSX } from "preact/jsx-runtime";
import clsx from "clsx";
import { Choice, type Move, type Board, Player } from "../types";
import { useGame, useRound } from "../hooks";
import { RoundProvider } from "../contexts";
import { size } from "../services/game";
import { Container } from "../components";
import { useEffect, useState } from "preact/hooks";

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
        className="absolute top-0 right-0 p-2 bg-purple-300/20 rounded-b-md shadow-md text-white font-semibold transition-colors hover:bg-purple-300/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute z-60 bg-white/5 backdrop-blur-lg shadow-lg rounded-lg w-full animate-slideIn max-w-2xl pt-2 min-h-[600px] max-h-[600px]  overflow-y-auto no-scrollbar">
            <h2 className="text-lg mt-2 font-semibold text-gray-100 mb-4 ml-8">
              Votre historique
            </h2>

            <ul className="mb-3 px-4 gap-3 flex-wrap flex justify-between">
              {history
                .sort((a, b) => b.id - a.id)
                .map((game, index) => (
                  <li
                    key={index}
                    className="p-3 flex flex-col justify-center items-center gap-4 rounded-lg transition-colors"
                  >
                    <span className="text-gray-100 font-semibold">
                      Partie {game.id} - {game.winner?.name || "Égalité"} -{" "}
                      {formatTimerInMinutes(game.duration)}
                    </span>
                    <SmallBoard board={game.board} />
                  </li>
                ))}
            </ul>

            <button
              className="absolute top-4 right-8 text-gray-400 hover:text-gray-100 transition-colors focus:outline-none text-xl font-bold"
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

  return (
    <div className="relative mb-8 p-4 rounded-lg flex justify-between items-center bg-white/5 backdrop-blur-lg shadow-lg border border-white/20">
      <HeaderPlayer player={player1} />
      <Timer />
      <HeaderPlayer player={player2} />
    </div>
  );
};

const Timer = (): JSX.Element => {
  const { timer, increaseTimer } = useRound();

  useEffect(() => {
    const interval = setInterval(() => {
      increaseTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative flex items-center justify-center w-24 h-24 bg-white/10 rounded-full shadow-md backdrop-blur-md border border-white/30">
        <div className="absolute w-full h-full animate-spin-slow bg-gradient-to-r from-purple-500 to-purple-500 rounded-full blur-md opacity-10"></div>
        <span className="text-white font-bold text-2xl">
          {formatTimerInMinutes(timer)}
        </span>
      </div>
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
  coordinates: Move;
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

interface SmallBoardProps {
  board: Board;
}

const SmallBoard = (props: SmallBoardProps): JSX.Element => {
  const { board } = props;

  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-white/5 backdrop-blur-lg shadow-md rounded-lg border border-white/10">
      {size.map((_, x) =>
        size.map((_, y) => (
          <SmallCell
            key={`${x}-${y}`}
            coordinates={{ x, y }}
            choice={board[x][y] as Choice}
          />
        )),
      )}
    </div>
  );
};

interface SmallCellProps {
  coordinates: Move;
  choice: Choice;
}

const SmallCell = (props: SmallCellProps): JSX.Element => {
  const { coordinates, choice } = props;

  return (
    <div
      data-coordinates={`${coordinates.x}-${coordinates.y}`}
      className={clsx(
        "w-16 h-16 rounded-md flex items-center justify-center text-2xl font-bold transition-transform",
        {
          "bg-purple-600 text-white shadow-md border-2 border-purple-500":
            choice === Choice.X,
          "bg-purple-500 text-white shadow-md border-2 border-purple-400":
            choice === Choice.O,
          "bg-white/5 text-gray-400 border-2 border-white/20": !choice,
        },
      )}
    >
      {choice}
    </div>
  );
};
