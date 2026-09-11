import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    BackHandler,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { Colors } from "@/constants/theme";
import {
    addDays,
    formatDate,
    toDateKey,
    useWorkspace,
    WorkspaceEvent,
} from "@/features/workspace";
import { useColorScheme } from "@/hooks/use-color-scheme";

const eventColors = [
  { label: "Coral", value: "#F4B3A3" },
  { label: "Blue", value: "#BED8EA" },
  { label: "Yellow", value: "#F4D98B" },
  { label: "Mint", value: "#C4E3D5" },
];

export default function CalendarScreen() {
  const { events, createEvent, updateEvent, deleteEvent } = useWorkspace();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [weekOffset, setWeekOffset] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("30m");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#F4B3A3");

  useEffect(() => {
    if (!isAdding) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setIsAdding(false);
      return true;
    });
    return () => sub.remove();
  }, [isAdding]);

  // Calculate 7-day week starting from current day + (weekOffset * 7)
  const week = useMemo(() => {
    const base = addDays(new Date(), weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => addDays(base, index));
  }, [weekOffset]);

  const dayEvents = useMemo(
    () =>
      events
        .filter((event) => event.date === selectedDate)
        .sort((left, right) => left.time.localeCompare(right.time)),
    [events, selectedDate],
  );

  function openNewEvent() {
    setEditingId(null);
    setTitle("");
    setTime("09:00");
    setDuration("30m");
    setDescription("");
    setColor("#F4B3A3");
    setIsAdding(true);
  }

  function openEditEvent(event: WorkspaceEvent) {
    setEditingId(event.id);
    setTitle(event.title);
    setTime(event.time);
    setDuration(event.duration);
    setDescription(event.description || "");
    setColor(event.color || "#F4B3A3");
    setIsAdding(true);
  }

  function submit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (editingId) {
      updateEvent(editingId, {
        title: trimmedTitle,
        time,
        duration,
        description,
        color,
      });
    } else {
      createEvent({
        title: trimmedTitle,
        date: selectedDate,
        time,
        duration,
        description,
        attendees: [],
        color,
      });
    }
    setTitle("");
    setDescription("");
    setEditingId(null);
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

  function goToToday() {
    setWeekOffset(0);
    setSelectedDate(toDateKey(new Date()));
  }

  return (
    <Workspace
      eyebrow="CALENDAR / YOUR SCHEDULE"
      title="Make room for good work."
      description="Your week at a glance, with enough space to breathe."
    >
      <View style={styles.navBar}>
        <View style={styles.navButtons}>
          <Pressable
            onPress={() => setWeekOffset((curr) => curr - 1)}
            style={[styles.navBtn, { backgroundColor: Colors[scheme].backgroundElement }]}
          >
            <ThemedText type="smallBold">‹ Prev</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setWeekOffset((curr) => curr + 1)}
            style={[styles.navBtn, { backgroundColor: Colors[scheme].backgroundElement }]}
          >
            <ThemedText type="smallBold">Next ›</ThemedText>
          </Pressable>
        </View>
        {weekOffset !== 0 && (
          <Pressable onPress={goToToday} style={styles.todayBtn}>
            <ThemedText type="smallBold" style={styles.todayText}>
              Today
            </ThemedText>
          </Pressable>
        )}
      </View>

      <View style={styles.week}>
        {week.map((date) => {
          const key = toDateKey(date);
          const isSelected = key === selectedDate;
          const isToday = key === toDateKey(new Date());
          return (
            <Pressable
              key={key}
              onPress={() => setSelectedDate(key)}
              style={[
                styles.day,
                isSelected && styles.selected,
                !isSelected && isToday && { borderColor: "#D7614B", borderWidth: 1 },
              ]}
            >
              <ThemedText
                type="small"
                style={{
                  color: isSelected ? "#272522" : Colors[scheme].textSecondary,
                }}
              >
                {date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .slice(0, 2)
                  .toUpperCase()}
              </ThemedText>
              <ThemedText
                style={[
                  styles.dayNumber,
                  { color: isSelected ? "#272522" : Colors[scheme].text },
                ]}
              >
                {date.getDate()}
              </ThemedText>
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
          onAction={() => (isAdding ? setIsAdding(false) : openNewEvent())}
        />
        {isAdding && (
          <Panel style={styles.form}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Event title"
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
            <View style={styles.formRow}>
              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="09:00"
                placeholderTextColor={Colors[scheme].textSecondary}
                style={[
                  styles.input,
                  styles.shortInput,
                  {
                    backgroundColor: Colors[scheme].inputBg,
                    color: Colors[scheme].text,
                    borderColor: Colors[scheme].border,
                  },
                ]}
              />
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="30m"
                placeholderTextColor={Colors[scheme].textSecondary}
                style={[
                  styles.input,
                  styles.shortInput,
                  {
                    backgroundColor: Colors[scheme].inputBg,
                    color: Colors[scheme].text,
                    borderColor: Colors[scheme].border,
                  },
                ]}
              />
            </View>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
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

            <View style={styles.colorGroup}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                TAG COLOR
              </ThemedText>
              <View style={styles.colorRow}>
                {eventColors.map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => setColor(c.value)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c.value },
                      color === c.value && styles.colorCircleSelected,
                    ]}
                  />
                ))}
              </View>
            </View>

            <Pressable onPress={submit} style={styles.submit}>
              <ThemedText style={styles.submitText}>
                {editingId ? "Save event" : "Add event"}
              </ThemedText>
            </Pressable>
          </Panel>
        )}
        <Panel>
          {dayEvents.map((event) => (
            <View key={event.id} style={styles.event}>
              <View style={styles.time}>
                <ThemedText type="smallBold">{event.time}</ThemedText>
                <View
                  style={[styles.line, { backgroundColor: Colors[scheme].border }]}
                />
              </View>
              <Pressable
                onPress={() => openEditEvent(event)}
                style={[styles.eventCard, { backgroundColor: event.color }]}
              >
                <View style={styles.eventHeader}>
                  <View style={styles.eventCopy}>
                    <ThemedText style={styles.eventTitle}>
                      {event.title}
                    </ThemedText>
                    <ThemedText type="small" style={styles.eventSubtitle}>
                      {event.description || "No description"} · {event.duration}
                    </ThemedText>
                  </View>
                  <Pressable
                    accessibilityLabel={`Delete ${event.title}`}
                    onPress={() => confirmDelete(event)}
                    hitSlop={8}
                  >
                    <ThemedText style={styles.delete}>×</ThemedText>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          ))}
          {dayEvents.length === 0 && (
            <ThemedText themeColor="textSecondary">
              No events planned for this day.
            </ThemedText>
          )}
        </Panel>
      </View>
      <Panel style={[styles.tip, { backgroundColor: scheme === "dark" ? "#38332B" : "#E8D7C5" }]}>
        <ThemedText style={styles.tipTitle}>Protect your focus</ThemedText>
        <ThemedText themeColor="textSecondary">
          Use open time for the deep work that needs your full, uninterrupted attention.
        </ThemedText>
      </Panel>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButtons: { flexDirection: "row", gap: 8 },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F4B3A3",
    borderRadius: 12,
  },
  todayText: { color: "#272522" },
  week: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  day: { alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 14, flex: 1 },
  selected: { backgroundColor: "#F4B3A3" },
  dayNumber: { fontSize: 18, fontWeight: "800" },
  form: { gap: 10, marginBottom: 12 },
  formRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  shortInput: { minWidth: 90 },
  colorGroup: { gap: 6 },
  colorRow: { flexDirection: "row", gap: 12 },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: {
    borderColor: "#272522",
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
  event: { flexDirection: "row", gap: 12 },
  time: { width: 48, alignItems: "center", gap: 8 },
  line: { width: 1, flex: 1 },
  eventCard: { flex: 1, padding: 14, borderRadius: 14, gap: 4 },
  eventHeader: { flexDirection: "row", gap: 8, alignItems: "center" },
  eventCopy: { flex: 1, gap: 4 },
  eventTitle: { fontWeight: "800", color: "#272522", fontSize: 16 },
  eventSubtitle: { color: "#4A453E" },
  delete: { color: "#D7614B", fontSize: 24, paddingHorizontal: 4 },
  tip: { padding: 18, borderRadius: 18, gap: 6 },
  tipTitle: { fontSize: 18, fontWeight: "800" },
});
