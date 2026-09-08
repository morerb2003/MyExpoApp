import { View, ViewProps } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemedViewProps = ViewProps & {
  type?: "backgroundElement";
};

export function ThemedView({ style, type, ...props }: ThemedViewProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const backgroundColor =
    type === "backgroundElement"
      ? Colors[scheme].backgroundElement
      : Colors[scheme].background;
  return <View style={[{ backgroundColor }, style]} {...props} />;
}
