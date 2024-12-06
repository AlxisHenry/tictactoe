import { JSX } from "preact/jsx-runtime";
import clsx from "clsx";
import { Choice, type Moov, type Board } from "../types";
import { useGame, useRound } from "../hooks";
import { RoundProvider } from "../contexts";
import { size } from "../services/game";
import { Container } from "../components";

export const Game = (): JSX.Element => {
  return (
    <RoundProvider>
      <Container>
        <Header />
        <Board />
        <History />
      </Container>
    </RoundProvider>
  );
};

const History = (): JSX.Element => {
  const { history } = useGame();

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Historique</h2>
      <pre>{JSON.stringify(history, null, 2)}</pre>
    </div>
  );
};

const Header = (): JSX.Element => {
  const { players } = useGame();
  const { currentPlayer, timer } = useRound();

  return (
    <div className="mb-6 flex justify-between items-center bg-red-500">
      <div className="flex items-center">
        {players.map((player) => (
          <div key={player.symbol} className="flex items-center mr-4">
            <span className="mr-2">{player.name}</span>
            <span>{player.wins}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Board = (): JSX.Element => {
  return (
    <div>
      <div className="grid grid-cols-3">
        {size.map((_, x) => (
          <div className="row" key={x}>
            {size.map((_, y) => (
              <Cell coordinates={{ x, y }} />
            ))}
          </div>
        ))}
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
      key={coordinates.y}
      onClick={() => play(x, y)}
      data-coordinates={`${coordinates.x}-${coordinates.y}`}
      className={clsx(
        "border border-gray-200 size-48 text-center flex items-center justify-center text-4xl font-bold",
        {
          "bg-blue-400": choice === Choice.X,
          "bg-red-400": choice === Choice.O,
          "transition cursor-pointer hover:scale-[1.025]": !choice,
          "hover:bg-blue-400": !choice && currentPlayer.symbol === Choice.X,
          "hover:bg-red-400": !choice && currentPlayer.symbol === Choice.O,
        },
      )}
    >
      {choice}
    </div>
  );
};
