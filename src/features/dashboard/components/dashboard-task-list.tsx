import { Pressable, StyleSheet, View } from "react-native";

import { Panel, ThemedText } from "@/components";
import { DashboardTask, TaskFilter, taskFilters } from "../types";

type DashboardTaskListProps = {
  filter: TaskFilter;
  tasks: DashboardTask[];
  onFilterChange: (filter: TaskFilter) => void;
  onToggleTask: (id: string) => void;
};

export function DashboardTaskList({
  filter,
  tasks,
  onFilterChange,
  onToggleTask,
}: DashboardTaskListProps) {
  return (
    <View>
      <View style={styles.filterRow}>
        {taskFilters.map((item) => (
          <Pressable
            key={item}
            onPress={() => onFilterChange(item)}
            style={[styles.filter, filter === item && styles.filterActive]}
          >
            <ThemedText
              type="smallBold"
              themeColor={filter === item ? "text" : "textSecondary"}
            >
              {item}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      <Panel>
        {tasks.map((task, index) => (
          <View key={task.id}>
            {index > 0 && <View style={styles.divider} />}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: task.done }}
              onPress={() => onToggleTask(task.id)}
              style={styles.taskRow}
            >
              <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                {task.done && <ThemedText style={styles.check}>✓</ThemedText>}
              </View>
              <View style={styles.taskCopy}>
                <ThemedText
                  style={[styles.taskTitle, task.done && styles.taskDone]}
                >
                  {task.title}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {task.meta}
                </ThemedText>
              </View>
              <View style={[styles.dot, styles[task.tone]]} />
              <ThemedText type="smallBold" themeColor="textSecondary">
                {task.label}
              </ThemedText>
            </Pressable>
          </View>
        ))}
        {tasks.length === 0 && (
          <ThemedText themeColor="textSecondary">
            Nothing here yet. Add a task to get moving.
          </ThemedText>
        )}
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: "row", gap: 6, marginBottom: 12 },
  filter: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  filterActive: { backgroundColor: "#F4B3A3" },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    minHeight: 48,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#C8BFB4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#6FB48C", borderColor: "#6FB48C" },
  check: { color: "#FFFDF8", fontWeight: "800" },
  taskCopy: { flex: 1, gap: 3 },
  taskTitle: { fontWeight: "700" },
  taskDone: { textDecorationLine: "line-through", opacity: 0.55 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  coral: { backgroundColor: "#D7614B" },
  blue: { backgroundColor: "#6C9CB8" },
  yellow: { backgroundColor: "#D5A92F" },
  mint: { backgroundColor: "#6FB48C" },
  divider: { height: 1, backgroundColor: "#E7E1D8", marginVertical: 8 },
});
