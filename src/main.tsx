import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";
import { GameProvider } from "./contexts";

render(
  <GameProvider>
    <App />
  </GameProvider>,
  document.getElementById("app")!,
);
