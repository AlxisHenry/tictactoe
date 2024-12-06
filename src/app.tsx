import { useGame } from "./hooks";
import { Layout, Game, StartingScreen } from "./components";

export function App() {
  const { isPlaying } = useGame();

  return <Layout>{isPlaying ? <Game /> : <StartingScreen />}</Layout>;
}
