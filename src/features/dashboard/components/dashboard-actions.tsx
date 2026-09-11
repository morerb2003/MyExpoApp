import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Panel, ThemedText } from "@/components";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type DashboardActionsProps = {
  isAdding: boolean;
  newTask: string;
  formattedTime: string;
  timerRunning: boolean;
  onToggleAdding: () => void;
  onChangeTask: (value: string) => void;
  onAddTask: () => void;
  onToggleTimer: () => void;
};

export function DashboardActions({
  isAdding,
  newTask,
  formattedTime,
  timerRunning,
  onToggleAdding,
  onChangeTask,
  onAddTask,
  onToggleTimer,
}: DashboardActionsProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleAdding}
          style={styles.primaryAction}
        >
          <ThemedText style={styles.primaryText}>
            {isAdding ? "Close" : "+ Add task"}
          </ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleTimer}
          style={[
            styles.secondaryAction,
            {
              backgroundColor:
                scheme === "dark" ? Colors.dark.backgroundElement : "#E8D7C5",
            },
          ]}
        >
          <ThemedText
            style={[
              styles.secondaryText,
              { color: scheme === "dark" ? Colors.dark.text : "#272522" },
            ]}
          >
            {timerRunning ? "Pause focus" : "Start focus"} · {formattedTime}
          </ThemedText>
        </Pressable>
      </View>
      {isAdding && (
        <Panel style={styles.addPanel}>
          <TextInput
            autoFocus
            value={newTask}
            onChangeText={onChangeTask}
            onSubmitEditing={onAddTask}
            placeholder="What needs doing?"
            placeholderTextColor={Colors[scheme].textSecondary}
            style={[styles.input, { color: Colors[scheme].text }]}
            returnKeyType="done"
            autoCapitalize="sentences"
          />
          <Pressable
            accessibilityRole="button"
            onPress={onAddTask}
            style={[
              styles.addButton,
              { backgroundColor: Colors[scheme].text },
            ]}
          >
            <ThemedText
              style={[styles.addText, { color: Colors[scheme].background }]}
            >
              Add
            </ThemedText>
          </Pressable>
        </Panel>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  primaryAction: {
    backgroundColor: "#D7614B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryText: { color: "#FFFDF8", fontWeight: "800" },
  secondaryAction: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryText: { fontWeight: "800" },
  addPanel: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  addButton: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addText: { fontWeight: "800" },
});
