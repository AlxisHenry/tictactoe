import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import {
  Choice,
  Difficulty,
  type Form,
  GameMode,
  defaultAI,
  defaultPlayer,
} from "../types";
import { useGame } from "../hooks";

export const StartingScreen = (): JSX.Element => {
  const { start } = useGame();

  const [form, setForm] = useState<Form>({
    player1: null,
    player2: null,
    mode: GameMode.Player,
  });

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-5xl font-extrabold text-white mb-8">Tic Tac Toe</h1>
      <div class="bg-white/5 p-8 rounded-xl shadow-lg backdrop-blur-md border border-white/30 w-96">
        <label class="block mb-4">
          <span class="text-lg font-semibold text-white">Votre nom</span>
          <input
            type="text"
            class="mt-1 block w-full rounded-md border-purple-300 bg-white/20 text-white placeholder-gray-200 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50"
            placeholder="Entrez votre nom"
            value={form.player1?.name}
            onChange={(e: any) => {
              if (!form.player1) {
                setForm({
                  ...form,
                  player1: {
                    ...defaultPlayer,
                    name: e.target.value,
                    symbol: Choice.X,
                  },
                });
              } else {
                setForm({
                  ...form,
                  player1: { ...form.player1, name: e.target.value },
                });
              }
            }}
          />
        </label>

        <div class="mb-4">
          <span class="text-lg font-semibold text-white">Mode de jeu :</span>
          <div class="mt-2">
            <label class="inline-flex items-center text-white">
              <input
                type="radio"
                name="mode"
                class="form-radio text-purple-600"
                checked={form.mode === GameMode.Player}
                onChange={() => setForm({ ...form, mode: GameMode.Player })}
              />
              <span class="ml-2">Jouer contre un autre joueur</span>
            </label>
            <label class="inline-flex items-center mt-2 text-white">
              <input
                type="radio"
                name="mode"
                class="form-radio text-purple-600"
                checked={form.mode === GameMode.AI}
                onChange={() => {
                  setForm({
                    ...form,
                    mode: GameMode.AI,
                    player2: {
                      ...defaultAI,
                      difficulty: Difficulty.Easy,
                    },
                  });
                }}
              />
              <span class="ml-2">Jouer contre une IA</span>
            </label>
          </div>
        </div>

        {form.mode === GameMode.Player && (
          <label class="block mb-4">
            <span class="text-lg font-semibold text-white">
              Nom du second joueur
            </span>
            <input
              type="text"
              class="mt-1 block w-full rounded-md border-purple-300 bg-white/20 text-white placeholder-gray-100 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50"
              placeholder="Entrez le nom du second joueur"
              onChange={(e: any) => {
                if (!form.player2) {
                  setForm({
                    ...form,
                    player2: {
                      ...defaultPlayer,
                      name: e.target.value,
                      symbol: Choice.O,
                    },
                  });
                } else {
                  setForm({
                    ...form,
                    player2: { ...form.player2, name: e.target.value },
                  });
                }
              }}
            />
          </label>
        )}

        {form.mode === GameMode.AI && (
          <label class="block mb-4">
            <span class="text-lg font-semibold text-white">Difficulté</span>
            <div class="flex flex-col">
              {Object.values(Difficulty).map((difficulty) => (
                <label class="inline-flex items-center mt-2 text-white">
                  <input
                    type="radio"
                    name="difficulty"
                    class="form-radio text-purple-600"
                    checked={form.player2?.difficulty === difficulty}
                    onChange={() => {
                      setForm({
                        ...form,
                        player2: {
                          ...defaultAI,
                          difficulty,
                        },
                      });
                    }}
                  />
                  <span class="ml-2">{difficulty}</span>
                </label>
              ))}
            </div>
          </label>
        )}

        <button
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={() => start(form.mode, form.player1, form.player2)}
        >
          Commencer le jeu
        </button>
      </div>
    </div>
  );
};
