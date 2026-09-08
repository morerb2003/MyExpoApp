import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
    Panel,
    SectionHeader,
    StatCard,
    Workspace,
} from "@/components/workspace";

type Task = {
  id: number;
  title: string;
  meta: string;
  label: string;
  tone: "coral" | "blue" | "yellow" | "mint";
  done: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Finalize Q3 launch plan",
    meta: "Product / due 10:30 AM",
    label: "TODAY",
    tone: "coral",
    done: false,
  },
  {
    id: 2,
    title: "Design review with Maya",
    meta: "Studio / 2:00 PM",
    label: "MEETING",
    tone: "blue",
    done: false,
  },
  {
    id: 3,
    title: "Write weekly reflection",
    meta: "Personal / before Friday",
    label: "LATER",
    tone: "yellow",
    done: false,
  },
  {
    id: 4,
    title: "Share research synthesis",
    meta: "Research / completed",
    label: "DONE",
    tone: "mint",
    done: true,
  },
];

const filters = ["All", "Open", "Done"] as const;
type Filter = (typeof filters)[number];

export default function HomeScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Filter>("All");
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 25 * 60;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  const completedCount = tasks.filter((task) => task.done).length;
  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          filter === "All" || (filter === "Done" ? task.done : !task.done),
      ),
    [filter, tasks],
  );
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done, label: !task.done ? "DONE" : "TODAY" }
          : task,
      ),
    );
  }

  function addTask() {
    const title = newTask.trim();
    if (!title) return;
    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        meta: "Personal / added just now",
        label: "NEW",
        tone: "coral",
        done: false,
      },
    ]);
    setNewTask("");
    setIsAdding(false);
    setFilter("All");
  }

  return (
    <Workspace
      eyebrow="GOOD MORNING, ALEX"
      title="Your work, in one place."
      description="A calm command center for the things that matter today."
    >
      <View style={styles.stats}>
        <StatCard
          label="Open tasks"
          value={String(tasks.length - completedCount)}
          tone="coral"
        />
        <StatCard
          label="Completed"
          value={String(completedCount).padStart(2, "0")}
          tone="mint"
        />
        <StatCard label="Focus hours" value="4.5" tone="yellow" />
      </View>

      <View style={styles.quickActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsAdding((value) => !value)}
          style={styles.primaryAction}
        >
          <ThemedText style={styles.primaryActionText}>+ Add task</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setTimerRunning((value) => !value)}
          style={styles.secondaryAction}
        >
          <ThemedText style={styles.secondaryActionText}>
            {timerRunning ? "Pause focus" : "Start focus"} · {formattedTime}
          </ThemedText>
        </Pressable>
      </View>

      {isAdding && (
        <Panel style={styles.addPanel}>
          <TextInput
            autoFocus
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
            placeholder="What needs doing?"
            placeholderTextColor="#756F67"
            style={styles.input}
            returnKeyType="done"
          />
          <Pressable
            accessibilityRole="button"
            onPress={addTask}
            style={styles.addButton}
          >
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </Pressable>
        </Panel>
      )}

      <View>
        <SectionHeader
          title="Today"
          action={filter === "All" ? "View all" : "Show all"}
          onAction={() => setFilter("All")}
        />
        <View style={styles.filterRow}>
          {filters.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
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
          {visibleTasks.map((task, index) => (
            <View key={task.id}>
              {index > 0 && <View style={styles.divider} />}
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.done }}
                onPress={() => toggleTask(task.id)}
                style={styles.taskRow}
              >
                <View
                  style={[styles.checkbox, task.done && styles.checkboxDone]}
                >
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
          {visibleTasks.length === 0 && (
            <ThemedText themeColor="textSecondary">
              Nothing here yet. Add a task to get moving.
            </ThemedText>
          )}
        </Panel>
      </View>

      <View style={styles.lowerGrid}>
        <Panel style={styles.progressPanel}>
          <View style={styles.progressHeader}>
            <ThemedText type="smallBold">WEEKLY MOMENTUM</ThemedText>
            <ThemedText style={styles.percent}>
              {Math.round((completedCount / tasks.length) * 100)}%
            </ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(8, (completedCount / tasks.length) * 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {completedCount} of {tasks.length} tasks complete
          </ThemedText>
        </Panel>
        <Panel style={styles.quote}>
          <ThemedText style={styles.quoteMark}>“</ThemedText>
          <ThemedText style={styles.quoteText}>
            Small progress is still progress.
          </ThemedText>
          <ThemedText type="small" style={styles.quoteLabel}>
            DAILY NOTE
          </ThemedText>
        </Panel>
      </View>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  quickActions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  primaryAction: {
    backgroundColor: "#D7614B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryActionText: { color: "#FFFDF8", fontWeight: "800" },
  secondaryAction: {
    backgroundColor: "#E8D7C5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryActionText: { color: "#272522", fontWeight: "800" },
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
  addButtonText: { color: "#FFFDF8", fontWeight: "800" },
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
  lowerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  progressPanel: { flex: 1, minWidth: 250, gap: 12 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },
  percent: { color: "#D7614B", fontWeight: "800" },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E6DED3",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: "#D7614B" },
  quote: {
    flex: 1,
    minWidth: 250,
    backgroundColor: "#272522",
    paddingVertical: 20,
  },
  quoteMark: { color: "#F4B3A3", fontSize: 42, lineHeight: 34 },
  quoteText: { color: "#FFFDF8", fontSize: 20, lineHeight: 27 },
  quoteLabel: { color: "#C4BDB3" },
});
