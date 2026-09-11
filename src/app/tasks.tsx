import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { Colors } from "@/constants/theme";
import {
    addDays,
    relativeDateLabel,
    toDateKey,
    useWorkspace,
    WorkspaceTask,
} from "@/features/workspace";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Filter = "all" | "open" | "done";

export default function TasksScreen() {
  const { tasks, createTask, updateTask, deleteTask, toggleTaskStatus } =
    useWorkspace();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const [filter, setFilter] = useState<Filter>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("Personal");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState(toDateKey(new Date()));
  const [editingId, setEditingId] = useState<string | null>(null);

  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          filter === "all" ||
          (filter === "done" ? task.status === "done" : task.status !== "done"),
      ),
    [filter, tasks],
  );
  const completedCount = tasks.filter((task) => task.status === "done").length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  function openNewTask() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setProject("Personal");
    setPriority("medium");
    setDueDate(toDateKey(new Date()));
    setIsAdding(true);
  }

  function openEditTask(task: WorkspaceTask) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setProject(task.project);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setIsAdding(true);
  }

  function submitTask() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (editingId) {
      updateTask(editingId, {
        title: trimmedTitle,
        description: description.trim(),
        project: project.trim() || "Personal",
        priority,
        dueDate,
      });
    } else {
      createTask({
        title: trimmedTitle,
        description: description.trim(),
        priority,
        dueDate,
        status: "todo",
        project: project.trim() || "Personal",
      });
    }
    setIsAdding(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  function confirmDelete(task: WorkspaceTask) {
    Alert.alert("Delete task?", task.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTask(task.id),
      },
    ]);
  }

  const todayKey = toDateKey(new Date());
  const tomorrowKey = toDateKey(addDays(new Date(), 1));
  const nextWeekKey = toDateKey(addDays(new Date(), 7));

  return (
    <Workspace
      eyebrow="TASKS / THIS WEEK"
      title="Make the next move."
      description="A focused list of what needs your attention, without the noise."
    >
      <View style={styles.filters}>
        {(["all", "open", "done"] as Filter[]).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filter,
              { backgroundColor: filter === item ? "#F4B3A3" : Colors[scheme].backgroundElement },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{ color: filter === item ? "#272522" : Colors[scheme].textSecondary }}
            >
              {item === "all"
                ? `All tasks ${tasks.length}`
                : item === "open"
                  ? `Open ${tasks.length - completedCount}`
                  : `Done ${completedCount}`}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      <View>
        <SectionHeader
          title={filter === "done" ? "Completed" : "Your tasks"}
          action={isAdding ? "Close" : "+ New task"}
          onAction={() => (isAdding ? setIsAdding(false) : openNewTask())}
        />
        {isAdding && (
          <Panel style={styles.form}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
              placeholderTextColor={Colors[scheme].textSecondary}
              style={[
                styles.input,
                {
                  backgroundColor: Colors[scheme].inputBg,
                  color: Colors[scheme].text,
                  borderColor: Colors[scheme].border,
                },
              ]}
              autoFocus
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor={Colors[scheme].textSecondary}
              style={[
                styles.input,
                styles.multilineInput,
                {
                  backgroundColor: Colors[scheme].inputBg,
                  color: Colors[scheme].text,
                  borderColor: Colors[scheme].border,
                },
              ]}
              multiline
            />
            <TextInput
              value={project}
              onChangeText={setProject}
              placeholder="Project (e.g. Product, Personal)"
              placeholderTextColor={Colors[scheme].textSecondary}
              style={[
                styles.input,
                {
                  backgroundColor: Colors[scheme].inputBg,
                  color: Colors[scheme].text,
                  borderColor: Colors[scheme].border,
                },
              ]}
            />

            <View style={styles.selectorGroup}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                PRIORITY
              </ThemedText>
              <View style={styles.chipRow}>
                {(["low", "medium", "high"] as const).map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.chip,
                      priority === p && styles.chipActive,
                      { borderColor: Colors[scheme].border },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      style={priority === p ? styles.chipTextActive : { color: Colors[scheme].textSecondary }}
                    >
                      {p.toUpperCase()}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.selectorGroup}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                DUE DATE
              </ThemedText>
              <View style={styles.chipRow}>
                {[
                  { label: "Today", key: todayKey },
                  { label: "Tomorrow", key: tomorrowKey },
                  { label: "Next week", key: nextWeekKey },
                ].map((d) => (
                  <Pressable
                    key={d.key}
                    onPress={() => setDueDate(d.key)}
                    style={[
                      styles.chip,
                      dueDate === d.key && styles.chipActive,
                      { borderColor: Colors[scheme].border },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      style={dueDate === d.key ? styles.chipTextActive : { color: Colors[scheme].textSecondary }}
                    >
                      {d.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable onPress={submitTask} style={styles.submit}>
              <ThemedText style={styles.submitText}>
                {editingId ? "Save task" : "Add task"}
              </ThemedText>
            </Pressable>
          </Panel>
        )}
        <Panel>
          {visibleTasks.map((task, index) => {
            const done = task.status === "done";
            return (
              <View key={task.id}>
                {index > 0 && (
                  <View
                    style={[styles.divider, { backgroundColor: Colors[scheme].border }]}
                  />
                )}
                <View style={styles.taskRow}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: done }}
                    onPress={() => toggleTaskStatus(task.id)}
                    style={[styles.checkbox, done && styles.checkboxDone]}
                  >
                    {done && <ThemedText style={styles.check}>✓</ThemedText>}
                  </Pressable>
                  <Pressable
                    onPress={() => openEditTask(task)}
                    style={styles.taskCopy}
                  >
                    <ThemedText style={[styles.taskTitle, done && styles.done]}>
                      {task.title}
                    </ThemedText>
                    {task.description ? (
                      <ThemedText
                        type="small"
                        themeColor="textSecondary"
                        numberOfLines={2}
                      >
                        {task.description}
                      </ThemedText>
                    ) : null}
                    <ThemedText type="small" themeColor="textSecondary">
                      {task.project} · {task.priority} priority ·{" "}
                      {relativeDateLabel(task.dueDate)}
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Delete ${task.title}`}
                    onPress={() => confirmDelete(task)}
                    hitSlop={10}
                  >
                    <ThemedText style={styles.delete}>×</ThemedText>
                  </Pressable>
                </View>
              </View>
            );
          })}
          {visibleTasks.length === 0 && (
            <ThemedText themeColor="textSecondary">
              Nothing here yet. Add a task to get moving.
            </ThemedText>
          )}
        </Panel>
      </View>
      <Panel style={styles.progress}>
        <ThemedText type="smallBold">WEEKLY PROGRESS</ThemedText>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`,
              },
            ]}
          />
        </View>
        <View style={styles.progressMeta}>
          <ThemedText type="small" themeColor="textSecondary">
            {completedCount} of {tasks.length} tasks complete
          </ThemedText>
          <ThemedText type="smallBold">
            {progressPercent}%
          </ThemedText>
        </View>
      </Panel>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 8 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  form: { gap: 12, marginBottom: 12 },
  input: {
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  selectorGroup: { gap: 6 },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "#F4B3A3",
    borderColor: "#D7614B",
  },
  chipTextActive: {
    color: "#272522",
    fontWeight: "800",
  },
  submit: {
    alignSelf: "flex-start",
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  submitText: { color: "#FFFDF8", fontWeight: "800" },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 54,
    paddingVertical: 4,
  },
  divider: { height: 1, marginVertical: 8 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#C8BFB4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#D7614B", borderColor: "#D7614B" },
  check: { color: "#FFFDF8", fontWeight: "800" },
  taskCopy: { flex: 1, gap: 3 },
  taskTitle: { fontWeight: "700", fontSize: 16 },
  done: { textDecorationLine: "line-through", opacity: 0.55 },
  delete: {
    color: "#D7614B",
    fontSize: 26,
    lineHeight: 26,
    paddingHorizontal: 6,
  },
  progress: { gap: 12 },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E6DED3",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#D7614B", borderRadius: 5 },
  progressMeta: { flexDirection: "row", justifyContent: "space-between" },
});
