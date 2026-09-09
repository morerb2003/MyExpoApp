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
import {
    relativeDateLabel,
    useWorkspace,
    WorkspaceNote,
} from "@/features/workspace";

export default function NotesScreen() {
  const { notes, createNote, updateNote, deleteNote, toggleNotePinned } =
    useWorkspace();
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Ideas");
  const { width } = useWindowDimensions();
  const columns = width < 520 ? 1 : width < 760 ? 2 : 3;
  const visibleNotes = useMemo(
    () =>
      notes.filter((note) =>
        `${note.title} ${note.body} ${note.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [notes, query],
  );

  function openNew() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setCategory("Ideas");
    setIsAdding(true);
  }
  function openEdit(note: WorkspaceNote) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setCategory(note.category);
    setIsAdding(true);
  }
  function submit() {
    if (!title.trim()) return;
    if (editingId)
      updateNote(editingId, { title: title.trim(), body, category });
    else
      createNote({
        title: title.trim(),
        body,
        category,
        color: "#F4D98B",
        pinned: false,
      });
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
              placeholderTextColor="#756F67"
              style={styles.input}
              autoFocus
            />
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Write something worth keeping..."
              placeholderTextColor="#756F67"
              style={[styles.input, styles.bodyInput]}
              multiline
            />
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="Category"
              placeholderTextColor="#756F67"
              style={styles.input}
            />
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
                <ThemedText type="smallBold" themeColor="textSecondary">
                  {relativeDateLabel(note.createdAt.slice(0, 10)).toUpperCase()}
                </ThemedText>
                <Pressable
                  accessibilityLabel={`Delete ${note.title}`}
                  onPress={() => confirmDelete(note)}
                >
                  <ThemedText style={styles.delete}>×</ThemedText>
                </Pressable>
              </View>
              <ThemedText style={styles.noteTitle}>{note.title}</ThemedText>
              <ThemedText style={styles.preview}>{note.body}</ThemedText>
              <Pressable onPress={() => toggleNotePinned(note.id)}>
                <ThemedText type="smallBold">
                  {note.pinned ? "PINNED" : "PIN NOTE"}
                </ThemedText>
              </Pressable>
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
                  <ThemedText style={styles.noteTitle}>{note.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
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
  form: { gap: 10, marginBottom: 12 },
  input: {
    backgroundColor: "#F7F3ED",
    borderRadius: 10,
    color: "#272522",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bodyInput: { minHeight: 90, textAlignVertical: "top" },
  submit: {
    alignSelf: "flex-start",
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitText: { color: "#FFFDF8", fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  note: { minHeight: 175, borderRadius: 16, padding: 16, gap: 10 },
  noteTop: { flexDirection: "row", justifyContent: "space-between" },
  noteTitle: { fontSize: 19, fontWeight: "800" },
  preview: { flex: 1, lineHeight: 21 },
  delete: { color: "#D7614B", fontSize: 24, lineHeight: 18 },
  pinned: { flexDirection: "row", gap: 14, alignItems: "center" },
  pin: { fontSize: 28, color: "#D7614B" },
  pinnedCopy: { flex: 1, gap: 4 },
});
