import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
    Panel,
    SectionHeader,
    StatCard,
    Workspace,
} from "@/components/workspace";

export default function HomeScreen() {
  return (
    <Workspace
      eyebrow="GOOD MORNING, ALEX"
      title="Your work, in one place."
      description="A calm command center for the things that matter today."
    >
      <View style={styles.stats}>
        <StatCard label="Open tasks" value="12" tone="coral" />
        <StatCard label="Completed" value="08" tone="mint" />
        <StatCard label="Focus hours" value="4.5" tone="yellow" />
      </View>
      <View>
        <SectionHeader title="Today" action="View all" />
        <Panel>
          <View style={styles.taskRow}>
            <View style={[styles.dot, styles.coral]} />
            <View style={styles.taskCopy}>
              <ThemedText style={styles.taskTitle}>
                Finalize Q3 launch plan
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Product / due 10:30 AM
              </ThemedText>
            </View>
            <ThemedText type="smallBold" themeColor="textSecondary">
              TODAY
            </ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.taskRow}>
            <View style={[styles.dot, styles.blue]} />
            <View style={styles.taskCopy}>
              <ThemedText style={styles.taskTitle}>
                Design review with Maya
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Studio / 2:00 PM
              </ThemedText>
            </View>
            <ThemedText type="smallBold" themeColor="textSecondary">
              MEETING
            </ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.taskRow}>
            <View style={[styles.dot, styles.yellow]} />
            <View style={styles.taskCopy}>
              <ThemedText style={styles.taskTitle}>
                Write weekly reflection
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Personal / before Friday
              </ThemedText>
            </View>
            <ThemedText type="smallBold" themeColor="textSecondary">
              LATER
            </ThemedText>
          </View>
        </Panel>
      </View>
      <View>
        <SectionHeader title="A little momentum" />
        <Panel style={styles.quote}>
          <ThemedText style={styles.quoteMark}>“</ThemedText>
          <ThemedText style={styles.quoteText}>
            Small progress is still progress. Keep the day moving.
          </ThemedText>
          <ThemedText type="small" style={styles.quoteLabel}>
            YOUR WORK APP · DAILY NOTE
          </ThemedText>
        </Panel>
      </View>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  taskRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  taskCopy: { flex: 1, gap: 3 },
  taskTitle: { fontWeight: "700" },
  dot: { width: 12, height: 12, borderRadius: 6 },
  coral: { backgroundColor: "#D7614B" },
  blue: { backgroundColor: "#6C9CB8" },
  yellow: { backgroundColor: "#D5A92F" },
  divider: { height: 1, backgroundColor: "#E7E1D8" },
  quote: { backgroundColor: "#272522", paddingVertical: 26 },
  quoteMark: { color: "#F4B3A3", fontSize: 48, lineHeight: 40 },
  quoteText: { color: "#FFFDF8", fontSize: 22, lineHeight: 29, maxWidth: 540 },
  quoteLabel: { color: "#C4BDB3" },
});
