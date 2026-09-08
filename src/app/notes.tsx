import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Panel, SectionHeader, Workspace } from "@/components/workspace";

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
  return (
    <Workspace
      eyebrow="NOTES / YOUR LIBRARY"
      title="Keep the good ideas close."
      description="A lightweight home for thinking, collecting, and coming back later."
    >
      <View style={styles.search}>
        <ThemedText themeColor="textSecondary">⌕ Search your notes</ThemedText>
        <ThemedText type="smallBold" style={styles.shortcut}>
          ⌘ K
        </ThemedText>
      </View>
      <View>
        <SectionHeader title="Recent notes" action="+ New note" />
        <View style={styles.grid}>
          {notes.map(([title, preview, date, color]) => (
            <Pressable
              key={title}
              style={[styles.note, { backgroundColor: color }]}
            >
              <ThemedText type="smallBold" themeColor="textSecondary">
                {date.toUpperCase()}
              </ThemedText>
              <ThemedText style={styles.noteTitle}>{title}</ThemedText>
              <ThemedText style={styles.preview}>{preview}</ThemedText>
              <ThemedText type="smallBold">OPEN NOTE ↗</ThemedText>
            </Pressable>
          ))}
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
  shortcut: {
    backgroundColor: "#E1D9CE",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  note: {
    width: "31%",
    minWidth: 160,
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
