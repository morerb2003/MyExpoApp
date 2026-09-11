import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { useWorkspaceOptional } from "@/features/workspace";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const rnScheme = useRNColorScheme();
  const workspace = useWorkspaceOptional();
  const preference = workspace?.settings?.appearance;

  if (preference === "dark") return "dark";
  if (preference === "light") return "light";

  if (hasHydrated) {
    return rnScheme ?? "light";
  }

  return "light";
}
