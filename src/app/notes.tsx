import { useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { Colors } from "@/constants/theme";
import {
    relativeDateLabel,
    useWorkspace,
    WorkspaceNote,
} from "@/features/workspace";
import { useColorScheme } from "@/hooks/use-color-scheme";

const noteColors = [
  { label: "Yellow", value: "#F4D98B" },
  { label: "Coral", value: "#F4B3A3" },
  { label: "Mint", value: "#C4E3D5" },
  { label: "Blue", value: "#BED8EA" },
  { label: "Sand", value: "#E8D7C5" },
];

export default function NotesScreen() {
  const { notes, createNote, updateNote, deleteNote, toggleNotePinned } =
    useWorkspace();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Ideas");
  const [color, setColor] = useState("#F4D98B");

  const { width } = useWindowDimensions();
  const columns = width < 520 ? 1 : width < 760 ? 2 : 3;

  const categories = useMemo(() => {
    const list = ["All"];
    notes.forEach((n) => {
      const cat = n.category?.trim();
      if (cat && !list.includes(cat)) list.push(cat);
    });
    return list;
  }, [notes]);

  const visibleNotes = useMemo(
    () =>
      notes.filter((note) => {
        const matchesCategory =
          selectedCategory === "All" || note.category === selectedCategory;
        const matchesQuery = `${note.title} ${note.body} ${note.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [notes, query, selectedCategory],
  );

  function openNew() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setCategory("Ideas");
    setColor("#F4D98B");
    setIsAdding(true);
  }

  function openEdit(note: WorkspaceNote) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setCategory(note.category);
    setColor(note.color || "#F4D98B");
    setIsAdding(true);
  }

  function submit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (editingId) {
      updateNote(editingId, {
        title: trimmedTitle,
        body,
        category: category.trim() || "Ideas",
        color,
      });
    } else {
      createNote({
        title: trimmedTitle,
        body,
        category: category.trim() || "Ideas",
        color,
        pinned: false,
      });
    }
    setIsAdding(false);
    setEditingId(null);
  }

  function confirmDelete(note: WorkspaceNote) {
    Alert.alert("Delete note?", note.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNote(note.id),
      },
    ]);
  }

  return (
    <Workspace
      eyebrow="NOTES / YOUR LIBRARY"
      title="Keep the good ideas close."
      description="A lightweight home for thinking, collecting, and coming back later."
    >
      <View
        style={[
          styles.search,
          {
            backgroundColor: Colors[scheme].backgroundElement,
            borderColor: Colors[scheme].border,
          },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your notes"
          placeholderTextColor={Colors[scheme].textSecondary}
          style={[styles.searchInput, { color: Colors[scheme].text }]}
          accessibilityLabel="Search your notes"
        />
        <ThemedText
          type="smallBold"
          style={[
            styles.shortcut,
            { backgroundColor: scheme === "dark" ? "#48443D" : "#E1D9CE" },
          ]}
        >
          ⌘ K
        </ThemedText>
      </View>

      <View style={styles.categoryBar}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === cat ? "#F4B3A3" : Colors[scheme].backgroundElement,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{
                color:
                  selectedCategory === cat ? "#272522" : Colors[scheme].textSecondary,
              }}
            >
              {cat}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View>
        <SectionHeader
          title="Recent notes"
          action={isAdding ? "Close" : "+ New note"}
          onAction={() => (isAdding ? setIsAdding(false) : openNew())}
        />
        {isAdding && (
          <Panel style={styles.form}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Note title"
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
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Write something worth keeping..."
              placeholderTextColor={Colors[scheme].textSecondary}
              style={[
                styles.input,
                styles.bodyInput,
                {
                  backgroundColor: Colors[scheme].inputBg,
                  color: Colors[scheme].text,
                  borderColor: Colors[scheme].border,
                },
              ]}
              multiline
            />
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="Category (e.g. Product, Ideas, Team)"
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
                NOTE COLOR
              </ThemedText>
              <View style={styles.colorRow}>
                {noteColors.map((c) => (
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
                {editingId ? "Save note" : "Add note"}
              </ThemedText>
            </Pressable>
          </Panel>
        )}
        <View style={styles.grid}>
          {visibleNotes.map((note) => (
            <Pressable
              key={note.id}
              onPress={() => openEdit(note)}
              style={[
                styles.note,
                {
                  backgroundColor: note.color,
                  width: columns === 1 ? "100%" : columns === 2 ? "48%" : "31%",
                },
              ]}
            >
              <View style={styles.noteTop}>
                <ThemedText type="smallBold" style={styles.noteCategory}>
                  {note.category?.toUpperCase() || "NOTE"} · {relativeDateLabel(note.createdAt.slice(0, 10)).toUpperCase()}
                </ThemedText>
                <Pressable
                  accessibilityLabel={`Delete ${note.title}`}
                  onPress={() => confirmDelete(note)}
                  hitSlop={8}
                >
                  <ThemedText style={styles.delete}>×</ThemedText>
                </Pressable>
              </View>
              <ThemedText style={styles.noteTitle}>{note.title}</ThemedText>
              <ThemedText style={styles.preview} numberOfLines={4}>
                {note.body}
              </ThemedText>
              <Pressable
                onPress={() => toggleNotePinned(note.id)}
                hitSlop={6}
                style={styles.pinButton}
              >
                <ThemedText type="smallBold" style={styles.pinBtnText}>
                  {note.pinned ? "★ PINNED" : "☆ PIN NOTE"}
                </ThemedText>
              </Pressable>
            </Pressable>
          ))}
          {visibleNotes.length === 0 && (
            <ThemedText themeColor="textSecondary">
              No notes match “{query}” in category “{selectedCategory}”.
            </ThemedText>
          )}
        </View>
      </View>
      <View>
        <SectionHeader title="Pinned" />
        <Panel>
          {notes
            .filter((note) => note.pinned)
            .map((note) => (
              <Pressable
                key={note.id}
                onPress={() => openEdit(note)}
                style={styles.pinned}
              >
                <ThemedText style={styles.pin}>✦</ThemedText>
                <View style={styles.pinnedCopy}>
                  <ThemedText style={styles.pinnedTitle}>{note.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                    {note.body}
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          {notes.every((note) => !note.pinned) && (
            <ThemedText themeColor="textSecondary">
              Pin a note to keep it close.
            </ThemedText>
          )}
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
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 16, padding: 0 },
  shortcut: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  categoryBar: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  form: { gap: 10, marginBottom: 12 },
  input: {
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  bodyInput: { minHeight: 90, textAlignVertical: "top" },
  colorGroup: { gap: 6 },
  colorRow: { flexDirection: "row", gap: 12 },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: { borderColor: "#272522" },
  submit: {
    alignSelf: "flex-start",
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitText: { color: "#FFFDF8", fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  note: { minHeight: 180, borderRadius: 16, padding: 16, gap: 8 },
  noteTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteCategory: { color: "#544E45", fontSize: 11 },
  noteTitle: { fontSize: 18, fontWeight: "800", color: "#272522" },
  preview: { flex: 1, lineHeight: 21, color: "#373430" },
  delete: { color: "#D7614B", fontSize: 24, paddingHorizontal: 4 },
  pinButton: { alignSelf: "flex-start", marginTop: 4 },
  pinBtnText: { color: "#272522", fontSize: 11 },
  pinned: { flexDirection: "row", gap: 14, alignItems: "center", paddingVertical: 4 },
  pin: { fontSize: 24, color: "#D7614B" },
  pinnedCopy: { flex: 1, gap: 4 },
  pinnedTitle: { fontWeight: "700" },
});
