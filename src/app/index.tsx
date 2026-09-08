import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
    Panel,
    SectionHeader,
    StatCard,
    Workspace,
} from "@/components/workspace";
import { DashboardActions } from "@/features/dashboard/components/dashboard-actions";
import { DashboardTaskList } from "@/features/dashboard/components/dashboard-task-list";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";

export default function HomeScreen() {
  const dashboard = useDashboard();
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  function submitTask() {
    if (dashboard.addTask(newTask)) {
      setNewTask("");
      setIsAdding(false);
    }
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
          value={String(dashboard.tasks.length - dashboard.completedCount)}
          tone="coral"
        />
        <StatCard
          label="Completed"
          value={String(dashboard.completedCount).padStart(2, "0")}
          tone="mint"
        />
        <StatCard label="Focus hours" value="4.5" tone="yellow" />
      </View>

      <DashboardActions
        isAdding={isAdding}
        newTask={newTask}
        formattedTime={dashboard.formattedTime}
        timerRunning={dashboard.timerRunning}
        onToggleAdding={() => setIsAdding((value) => !value)}
        onChangeTask={setNewTask}
        onAddTask={submitTask}
        onToggleTimer={() => dashboard.setTimerRunning((value) => !value)}
      />

      <View>
        <SectionHeader
          title="Today"
          action={dashboard.filter === "All" ? "View all" : "Show all"}
          onAction={() => dashboard.setFilter("All")}
        />
        <DashboardTaskList
          filter={dashboard.filter}
          tasks={dashboard.visibleTasks}
          onFilterChange={dashboard.setFilter}
          onToggleTask={dashboard.toggleTask}
        />
      </View>

      <View style={styles.lowerGrid}>
        <Panel style={styles.progressPanel}>
          <View style={styles.progressHeader}>
            <ThemedText type="smallBold">WEEKLY MOMENTUM</ThemedText>
            <ThemedText style={styles.percent}>
              {Math.round(
                (dashboard.completedCount / dashboard.tasks.length) * 100,
              )}
              %
            </ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(8, (dashboard.completedCount / dashboard.tasks.length) * 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {dashboard.completedCount} of {dashboard.tasks.length} tasks
            complete
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
