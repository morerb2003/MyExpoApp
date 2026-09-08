import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Panel, SectionHeader, Workspace } from "@/components/workspace";

const tasks = [
  ["Finalize Q3 launch plan", "Product", "High"],
  ["Send research synthesis", "Research", "Medium"],
  ["Book customer interviews", "Growth", "Low"],
  ["Update onboarding checklist", "Operations", "Medium"],
];

export default function TasksScreen() {
  const [completed, setCompleted] = useState<string[]>([]);
  return (
    <Workspace
      eyebrow="TASKS / THIS WEEK"
      title="Make the next move."
      description="A focused list of what needs your attention, without the noise."
    >
      <View style={styles.filters}>
        <View style={styles.filterActive}>
          <ThemedText type="smallBold">All tasks 12</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          My tasks 8
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Assigned 4
        </ThemedText>
      </View>
      <View>
        <SectionHeader title="In progress" action="+ New task" />
        <Panel>
          {tasks.map(([title, group, priority], index) => {
            const done = completed.includes(title);
            return (
              <Pressable
                key={title}
                onPress={() =>
                  setCompleted((items) =>
                    done
                      ? items.filter((item) => item !== title)
                      : [...items, title],
                  )
                }
                style={styles.taskRow}
              >
                <View style={[styles.checkbox, done && styles.checkboxDone]}>
                  {done && <ThemedText style={styles.check}>✓</ThemedText>}
                </View>
                <View style={styles.taskCopy}>
                  <ThemedText style={[styles.taskTitle, done && styles.done]}>
                    {title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {group} · {priority} priority
                  </ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {index === 0 ? "TODAY" : "FRI"}
                </ThemedText>
              </Pressable>
            );
          })}
        </Panel>
      </View>
      <Panel style={styles.progress}>
        <ThemedText type="smallBold">WEEKLY PROGRESS</ThemedText>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.progressMeta}>
          <ThemedText type="small" themeColor="textSecondary">
            8 of 12 tasks complete
          </ThemedText>
          <ThemedText type="smallBold">67%</ThemedText>
        </View>
      </Panel>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", alignItems: "center", gap: 20 },
  filterActive: {
    backgroundColor: "#F4B3A3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
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
  checkboxDone: { backgroundColor: "#D7614B", borderColor: "#D7614B" },
  check: { color: "#FFFDF8", fontWeight: "800" },
  taskCopy: { flex: 1, gap: 3 },
  taskTitle: { fontWeight: "700" },
  done: { textDecorationLine: "line-through", opacity: 0.55 },
  progress: { gap: 12 },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E6DED3",
    overflow: "hidden",
  },
  progressFill: {
    width: "67%",
    height: "100%",
    backgroundColor: "#D7614B",
    borderRadius: 5,
  },
  progressMeta: { flexDirection: "row", justifyContent: "space-between" },
});
