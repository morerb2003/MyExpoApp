import { StyleSheet, View } from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";

const days = ["08", "09", "10", "11", "12"];
const events = [
  ["09:00", "Deep work block", "Focus time · 2h", "#F4B3A3"],
  ["14:00", "Design review with Maya", "Studio team · 45m", "#BED8EA"],
  ["16:30", "Weekly wrap-up", "Personal · 30m", "#C4E3D5"],
];

export default function CalendarScreen() {
  return (
    <Workspace
      eyebrow="CALENDAR / SEPTEMBER 2026"
      title="Make room for good work."
      description="Your week at a glance, with enough space to breathe."
    >
      <View style={styles.week}>
        <ThemedText type="small" themeColor="textSecondary">
          MON
        </ThemedText>
        {days.map((day, index) => (
          <View key={day} style={[styles.day, index === 0 && styles.selected]}>
            <ThemedText type="small" themeColor="textSecondary">
              {["M", "T", "W", "T", "F"][index]}
            </ThemedText>
            <ThemedText style={styles.dayNumber}>{day}</ThemedText>
          </View>
        ))}
      </View>
      <View>
        <SectionHeader title="Monday, September 8" action="+ Add event" />
        <Panel>
          {events.map(([time, title, detail, color]) => (
            <View key={title} style={styles.event}>
              <View style={styles.time}>
                <ThemedText type="smallBold">{time}</ThemedText>
                <View style={styles.line} />
              </View>
              <View style={[styles.eventCard, { backgroundColor: color }]}>
                <ThemedText style={styles.eventTitle}>{title}</ThemedText>
                <ThemedText type="small">{detail}</ThemedText>
              </View>
            </View>
          ))}
        </Panel>
      </View>
      <Panel style={styles.tip}>
        <ThemedText style={styles.tipTitle}>Protect your focus</ThemedText>
        <ThemedText themeColor="textSecondary">
          You have 2 hours of open time this afternoon. A good moment for the
          work that needs your full attention.
        </ThemedText>
      </Panel>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  week: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  day: { alignItems: "center", gap: 8, padding: 10, borderRadius: 14 },
  selected: { backgroundColor: "#F4B3A3" },
  dayNumber: { fontSize: 20, fontWeight: "800" },
  event: { flexDirection: "row", gap: 12 },
  time: { width: 48, alignItems: "center", gap: 8 },
  line: { width: 1, flex: 1, backgroundColor: "#E5DDD3" },
  eventCard: { flex: 1, padding: 14, borderRadius: 14, gap: 4 },
  eventTitle: { fontWeight: "800" },
  tip: { backgroundColor: "#E8D7C5" },
  tipTitle: { fontSize: 18, fontWeight: "800" },
});
