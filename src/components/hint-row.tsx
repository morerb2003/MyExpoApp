import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";

type HintRowProps = {
  title: string;
  hint: React.ReactNode;
};

export function HintRow({ title, hint }: HintRowProps) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {hint}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two },
  title: { fontWeight: "600" },
});
