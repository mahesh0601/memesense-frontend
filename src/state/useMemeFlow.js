import { useContext } from "react";
import { MemeFlowContext } from "./memeFlowContext";

export function useMemeFlow() {
  const value = useContext(MemeFlowContext);

  if (!value) {
    throw new Error("useMemeFlow must be used inside MemeFlowProvider");
  }

  return value;
}
