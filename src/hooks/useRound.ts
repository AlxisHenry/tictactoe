import { useContext } from "preact/hooks";
import { RoundContext } from "../contexts";

export const useRound = () => {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error("useRound must be used within a RoundProvider");
  }
  return context;
};
