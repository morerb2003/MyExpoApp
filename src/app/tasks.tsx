import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import {
    relativeDateLabel,
    useWorkspace,
    WorkspaceTask,
} from "@/features/workspace";

type Filter = "all" | "open" | "done";

export default function TasksScreen() {
  const { tasks, createTask, updateTask, deleteTask, toggleTaskStatus } =
    useWorkspace();
  const [filter, setFilter] = useState<Filter>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("Personal");
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

  function openNewTask() {
    setEditingId(null);
    setTitle("");
    setProject("Personal");
    setIsAdding(true);
  }

  function openEditTask(task: WorkspaceTask) {
    setEditingId(task.id);
    setTitle(task.title);
    setProject(task.project);
    setIsAdding(true);
  }

  function submitTask() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (editingId) {
      updateTask(editingId, {
        title: trimmedTitle,
        project: project.trim() || "Personal",
      });
    } else {
      createTask({
        title: trimmedTitle,
        description: "",
        priority: "medium",
        dueDate: new Date().toISOString().slice(0, 10),
        status: "todo",
        project: project.trim() || "Personal",
      });
    }
    setIsAdding(false);
    setEditingId(null);
    setTitle("");
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
            style={[styles.filter, filter === item && styles.filterActive]}
          >
            <ThemedText type="smallBold">
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
              onSubmitEditing={submitTask}
              placeholder="Task title"
              placeholderTextColor="#756F67"
              style={styles.input}
              autoFocus
            />
            <TextInput
              value={project}
              onChangeText={setProject}
              onSubmitEditing={submitTask}
              placeholder="Project"
              placeholderTextColor="#756F67"
              style={styles.input}
            />
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
                {index > 0 && <View style={styles.divider} />}
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
                    <ThemedText type="small" themeColor="textSecondary">
                      {task.project} · {task.priority} priority ·{" "}
                      {relativeDateLabel(task.dueDate)}
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Delete ${task.title}`}
                    onPress={() => confirmDelete(task)}
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
            {tasks.length
              ? Math.round((completedCount / tasks.length) * 100)
              : 0}
            %
          </ThemedText>
        </View>
      </Panel>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 8 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  filterActive: { backgroundColor: "#F4B3A3" },
  form: { gap: 10, marginBottom: 12 },
  input: {
    backgroundColor: "#F7F3ED",
    borderRadius: 10,
    color: "#272522",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  submit: {
    alignSelf: "flex-start",
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitText: { color: "#FFFDF8", fontWeight: "800" },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 54,
  },
  divider: { height: 1, backgroundColor: "#E7E1D8", marginVertical: 8 },
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
  taskTitle: { fontWeight: "700" },
  done: { textDecorationLine: "line-through", opacity: 0.55 },
  delete: {
    color: "#D7614B",
    fontSize: 26,
    lineHeight: 26,
    paddingHorizontal: 5,
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
