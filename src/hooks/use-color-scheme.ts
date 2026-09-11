import { useColorScheme as useRNColorScheme } from "react-native";
import { useWorkspaceOptional } from "@/features/workspace";

export function useColorScheme() {
  const rnScheme = useRNColorScheme();
  const workspace = useWorkspaceOptional();
  const preference = workspace?.settings?.appearance;

  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return rnScheme ?? "light";
}
