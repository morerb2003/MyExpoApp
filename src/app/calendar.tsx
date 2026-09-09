import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import {
    addDays,
    formatDate,
    toDateKey,
    useWorkspace,
    WorkspaceEvent,
} from "@/features/workspace";

export default function CalendarScreen() {
  const { events, createEvent, deleteEvent } = useWorkspace();
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("30m");
  const [description, setDescription] = useState("");
  const week = Array.from({ length: 5 }, (_, index) =>
    addDays(new Date(), index),
  );
  const dayEvents = useMemo(
    () =>
      events
        .filter((event) => event.date === selectedDate)
        .sort((left, right) => left.time.localeCompare(right.time)),
    [events, selectedDate],
  );

  function submit() {
    if (!title.trim()) return;
    createEvent({
      title: title.trim(),
      date: selectedDate,
      time,
      duration,
      description,
      attendees: [],
      color: "#F4B3A3",
    });
    setTitle("");
    setDescription("");
    setIsAdding(false);
  }
  function confirmDelete(event: WorkspaceEvent) {
    Alert.alert("Delete event?", event.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteEvent(event.id),
      },
    ]);
  }

  return (
    <Workspace
      eyebrow="CALENDAR / YOUR WEEK"
      title="Make room for good work."
      description="Your week at a glance, with enough space to breathe."
    >
      <View style={styles.week}>
        {week.map((date) => {
          const key = toDateKey(date);
          return (
            <Pressable
              key={key}
              onPress={() => setSelectedDate(key)}
              style={[styles.day, key === selectedDate && styles.selected]}
            >
              <ThemedText type="small" themeColor="textSecondary">
                {date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .slice(0, 2)
                  .toUpperCase()}
              </ThemedText>
              <ThemedText style={styles.dayNumber}>{date.getDate()}</ThemedText>
            </Pressable>
          );
        })}
      </View>
      <View>
        <SectionHeader
          title={formatDate(selectedDate, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          action={isAdding ? "Close" : "+ Add event"}
          onAction={() => setIsAdding((value) => !value)}
        />
        {isAdding && (
          <Panel style={styles.form}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Event title"
              placeholderTextColor="#756F67"
              style={styles.input}
              autoFocus
            />
            <View style={styles.formRow}>
              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="09:00"
                placeholderTextColor="#756F67"
                style={[styles.input, styles.shortInput]}
              />
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="30m"
                placeholderTextColor="#756F67"
                style={[styles.input, styles.shortInput]}
              />
            </View>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor="#756F67"
              style={styles.input}
            />
            <Pressable onPress={submit} style={styles.submit}>
              <ThemedText style={styles.submitText}>Add event</ThemedText>
            </Pressable>
          </Panel>
        )}
        <Panel>
          {dayEvents.map((event) => (
            <View key={event.id} style={styles.event}>
              <View style={styles.time}>
                <ThemedText type="smallBold">{event.time}</ThemedText>
                <View style={styles.line} />
              </View>
              <View
                style={[styles.eventCard, { backgroundColor: event.color }]}
              >
                <View style={styles.eventHeader}>
                  <View style={styles.eventCopy}>
                    <ThemedText style={styles.eventTitle}>
                      {event.title}
                    </ThemedText>
                    <ThemedText type="small">
                      {event.description || "No description"} · {event.duration}
                    </ThemedText>
                  </View>
                  <Pressable
                    accessibilityLabel={`Delete ${event.title}`}
                    onPress={() => confirmDelete(event)}
                  >
                    <ThemedText style={styles.delete}>×</ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          {dayEvents.length === 0 && (
            <ThemedText themeColor="textSecondary">
              No events planned for this day.
            </ThemedText>
          )}
        </Panel>
      </View>
      <Panel style={styles.tip}>
        <ThemedText style={styles.tipTitle}>Protect your focus</ThemedText>
        <ThemedText themeColor="textSecondary">
          Use open time for the work that needs your full attention.
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
  form: { gap: 10, marginBottom: 12 },
  formRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    backgroundColor: "#F7F3ED",
    borderRadius: 10,
    color: "#272522",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  shortInput: { minWidth: 90 },
  submit: {
    alignSelf: "flex-start",
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitText: { color: "#FFFDF8", fontWeight: "800" },
  event: { flexDirection: "row", gap: 12 },
  time: { width: 48, alignItems: "center", gap: 8 },
  line: { width: 1, flex: 1, backgroundColor: "#E5DDD3" },
  eventCard: { flex: 1, padding: 14, borderRadius: 14, gap: 4 },
  eventHeader: { flexDirection: "row", gap: 8 },
  eventCopy: { flex: 1, gap: 4 },
  eventTitle: { fontWeight: "800" },
  delete: { color: "#D7614B", fontSize: 24 },
  tip: { backgroundColor: "#E8D7C5" },
  tipTitle: { fontSize: 18, fontWeight: "800" },
});
