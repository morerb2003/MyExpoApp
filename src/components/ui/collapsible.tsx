import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

export function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setIsOpen((value) => !value)}
        style={styles.header}
      >
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText type="small">{isOpen ? "Hide" : "Show"}</ThemedText>
      </Pressable>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.two,
  },
  content: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
});
