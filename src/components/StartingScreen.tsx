import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { Choice, type Form, GameMode } from "../types";
import { useGame } from "../hooks";

export const StartingScreen = (): JSX.Element => {
  const { start } = useGame();

  const [form, setForm] = useState<Form>({
    player1: null,
    player2: null,
    mode: GameMode.Player,
  });

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-700 text-white">
      <h1 class="text-4xl font-bold mb-8">Tic Tac Toe</h1>

      <div class="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-96">
        <label class="block mb-4">
          <span class="text-lg font-semibold">Votre nom</span>
          <input
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
            placeholder="Entrez votre nom"
            value={form.player1?.name}
            onChange={(e: any) => {
              if (!form.player1) {
                setForm({
                  ...form,
                  player1: {
                    name: e.target.value,
                    score: 0,
                    symbol: Choice.X,
                    isAI: false,
                    wins: 0,
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
          <span class="text-lg font-semibold">Mode de jeu :</span>
          <div class="mt-2">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="mode"
                class="form-radio text-indigo-600"
                checked={form.mode === GameMode.Player}
                onChange={() => setForm({ ...form, mode: GameMode.Player })}
              />
              <span class="ml-2">Jouer contre un autre joueur</span>
            </label>
            <label class="inline-flex items-center mt-2">
              <input
                type="radio"
                name="mode"
                class="form-radio text-indigo-600"
                checked={form.mode === GameMode.AI}
                onChange={() => setForm({ ...form, mode: GameMode.AI })}
              />
              <span class="ml-2">Jouer contre une IA</span>
            </label>
          </div>
        </div>

        {form.mode === GameMode.Player && (
          <label class="block mb-4">
            <span class="text-lg font-semibold">Nom du second joueur</span>
            <input
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              placeholder="Entrez le nom du second joueur"
              onChange={(e: any) => {
                if (!form.player2) {
                  setForm({
                    ...form,
                    player2: {
                      name: e.target.value,
                      score: 0,
                      symbol: Choice.O,
                      isAI: false,
                      wins: 0,
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

        <button
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={() => start(form.mode, form.player1, form.player2)}
        >
          Commencer le jeu
        </button>
      </div>
    </div>
  );
};
