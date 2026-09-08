import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Panel, ThemedText } from "@/components";

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
          style={styles.secondaryAction}
        >
          <ThemedText style={styles.secondaryText}>
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
            placeholderTextColor="#756F67"
            style={styles.input}
            returnKeyType="done"
          />
          <Pressable
            accessibilityRole="button"
            onPress={onAddTask}
            style={styles.addButton}
          >
            <ThemedText style={styles.addText}>Add</ThemedText>
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
    backgroundColor: "#E8D7C5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryText: { color: "#272522", fontWeight: "800" },
  addPanel: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    color: "#272522",
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  addButton: {
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addText: { color: "#FFFDF8", fontWeight: "800" },
});
