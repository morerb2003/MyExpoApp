import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
    Panel,
    SectionHeader,
    StatCard,
    ThemedText,
    Workspace,
} from "@/components";
import {
    DashboardActions,
    DashboardTaskList,
    useDashboard,
} from "@/features/dashboard";

export default function HomeScreen() {
  const dashboard = useDashboard();
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const eyebrow = useMemo(() => {
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12
        ? "GOOD MORNING"
        : hour < 17
          ? "GOOD AFTERNOON"
          : "GOOD EVENING";
    const firstName =
      (dashboard.settings.profileName.trim().split(" ")[0] || "ALEX").toUpperCase();
    return `${timeGreeting}, ${firstName}`;
  }, [dashboard.settings.profileName]);

  const taskCount = dashboard.tasks.length;
  const momentumPercent =
    taskCount > 0
      ? Math.round((dashboard.completedCount / taskCount) * 100)
      : 0;

  function submitTask() {
    if (dashboard.addTask(newTask)) {
      setNewTask("");
      setIsAdding(false);
    }
  }

  return (
    <Workspace
      eyebrow={eyebrow}
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
        <StatCard
          label="Focus hours"
          value={dashboard.focusHours}
          tone="yellow"
        />
      </View>

      <DashboardActions
        isAdding={isAdding}
        newTask={newTask}
        formattedTime={dashboard.formattedTime}
        timerRunning={dashboard.timerRunning}
        onToggleAdding={() => setIsAdding((value) => !value)}
        onChangeTask={setNewTask}
        onAddTask={submitTask}
        onToggleTimer={dashboard.toggleTimer}
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
            <ThemedText style={styles.percent}>{momentumPercent}%</ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${taskCount > 0 ? Math.max(8, (dashboard.completedCount / taskCount) * 100) : 0}%`,
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

      <View>
        <SectionHeader title="Recent workspace activity" />
        <Panel style={styles.activityPanel}>
          {dashboard.activities.slice(0, 4).map((activity, index) => (
            <View key={activity.id}>
              {index > 0 && <View style={styles.activityDivider} />}
              <View style={styles.activityRow}>
                <View
                  style={[
                    styles.activityDot,
                    toneDotStyles[activity.tone] || toneDotStyles.neutral,
                  ]}
                />
                <View style={styles.activityCopy}>
                  <ThemedText style={styles.activityText}>
                    <ThemedText style={styles.activityActor}>
                      {activity.actor}{" "}
                    </ThemedText>
                    {activity.message}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {activity.timestamp}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
          {dashboard.activities.length === 0 && (
            <ThemedText themeColor="textSecondary">
              No workspace activities recorded yet.
            </ThemedText>
          )}
        </Panel>
      </View>
    </Workspace>
  );
}

const toneDotStyles = StyleSheet.create({
  coral: { backgroundColor: "#D7614B" },
  mint: { backgroundColor: "#6FB48C" },
  yellow: { backgroundColor: "#D5A92F" },
  blue: { backgroundColor: "#6C9CB8" },
  neutral: { backgroundColor: "#9A9187" },
});

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
  activityPanel: { gap: 8 },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityCopy: { flex: 1, gap: 2 },
  activityText: { fontSize: 14, lineHeight: 20 },
  activityActor: { fontWeight: "700" },
  activityDivider: { height: 1, backgroundColor: "#E7E1D8", marginVertical: 6, opacity: 0.6 },
});
