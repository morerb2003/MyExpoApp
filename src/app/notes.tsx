import { useMemo, useState } from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";

const notes = [
  [
    "Launch notes",
    "A few thoughts after the customer call...",
    "Today",
    "#F4B3A3",
  ],
  [
    "Ideas to explore",
    "What if the first-run experience felt...",
    "Yesterday",
    "#F4D98B",
  ],
  [
    "Team rituals",
    "Keep the Monday kickoff short and useful.",
    "Sep 05",
    "#C4E3D5",
  ],
];

export default function NotesScreen() {
  const [query, setQuery] = useState("");
  const { width } = useWindowDimensions();
  const columns = width < 520 ? 1 : width < 760 ? 2 : 3;
  const visibleNotes = useMemo(
    () =>
      notes.filter(([title, preview]) =>
        `${title} ${preview}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <Workspace
      eyebrow="NOTES / YOUR LIBRARY"
      title="Keep the good ideas close."
      description="A lightweight home for thinking, collecting, and coming back later."
    >
      <View style={styles.search}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your notes"
          placeholderTextColor="#756F67"
          style={styles.searchInput}
          accessibilityLabel="Search your notes"
        />
        <ThemedText type="smallBold" style={styles.shortcut}>
          ⌘ K
        </ThemedText>
      </View>
      <View>
        <SectionHeader title="Recent notes" action="+ New note" />
        <View style={styles.grid}>
          {visibleNotes.map(([title, preview, date, color]) => (
            <Pressable
              key={title}
              style={[
                styles.note,
                {
                  backgroundColor: color,
                  width: columns === 1 ? "100%" : columns === 2 ? "48%" : "31%",
                },
              ]}
            >
              <ThemedText type="smallBold" themeColor="textSecondary">
                {date.toUpperCase()}
              </ThemedText>
              <ThemedText style={styles.noteTitle}>{title}</ThemedText>
              <ThemedText style={styles.preview}>{preview}</ThemedText>
              <ThemedText type="smallBold">OPEN NOTE ↗</ThemedText>
            </Pressable>
          ))}
          {visibleNotes.length === 0 && (
            <ThemedText themeColor="textSecondary">
              No notes match “{query}”.
            </ThemedText>
          )}
        </View>
      </View>
      <View>
        <SectionHeader title="Pinned" />
        <Panel>
          <View style={styles.pinned}>
            <ThemedText style={styles.pin}>✦</ThemedText>
            <View style={styles.pinnedCopy}>
              <ThemedText style={styles.noteTitle}>
                Writing principles
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Be clear. Be kind. Leave things better than you found them.
              </ThemedText>
            </View>
          </View>
        </Panel>
      </View>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEEAE2",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: { flex: 1, color: "#272522", fontSize: 16, padding: 0 },
  shortcut: {
    backgroundColor: "#E1D9CE",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  note: {
    minHeight: 175,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  noteTitle: { fontSize: 19, fontWeight: "800" },
  preview: { flex: 1, lineHeight: 21 },
  pinned: { flexDirection: "row", gap: 14, alignItems: "center" },
  pin: { fontSize: 28, color: "#D7614B" },
  pinnedCopy: { flex: 1, gap: 4 },
});
