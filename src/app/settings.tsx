import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { useWorkspace } from "@/features/workspace";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const { settings, updateSettings } = useWorkspace();
  const [editing, setEditing] = useState(false);
  const [profileName, setProfileName] = useState(settings.profileName);
  const initials = settings.profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  function saveProfile() {
    if (profileName.trim()) updateSettings({ profileName: profileName.trim() });
    setEditing(false);
  }
  return (
    <Workspace
      eyebrow="SETTINGS / WORK APP"
      title="Make it feel like yours."
      description="Your preferences, your rhythm, your workspace."
    >
      <Panel style={styles.profile}>
        <View style={styles.profileAvatar}>
          <ThemedText style={styles.profileInitials}>{initials}</ThemedText>
        </View>
        <View style={styles.profileCopy}>
          {editing ? (
            <TextInput
              value={profileName}
              onChangeText={setProfileName}
              onSubmitEditing={saveProfile}
              style={styles.input}
              autoFocus
            />
          ) : (
            <>
              <ThemedText style={styles.name}>
                {settings.profileName}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {settings.email}
              </ThemedText>
            </>
          )}
        </View>
        <Pressable onPress={() => (editing ? saveProfile() : setEditing(true))}>
          <ThemedText type="smallBold" style={styles.edit}>
            {editing ? "Save" : "Edit"}
          </ThemedText>
        </Pressable>
      </Panel>
      <View>
        <SectionHeader title="Preferences" />
        <Panel>
          <Pressable
            onPress={() =>
              updateSettings({ notifications: !settings.notifications })
            }
            style={styles.row}
          >
            <View style={styles.rowCopy}>
              <ThemedText style={styles.name}>Notifications</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {settings.notifications ? "On · daily digest enabled" : "Off"}
              </ThemedText>
            </View>
            <ThemedText style={styles.value}>
              {settings.notifications ? "ON" : "OFF"}
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() =>
              updateSettings({ dailyDigest: !settings.dailyDigest })
            }
            style={styles.row}
          >
            <View style={styles.rowCopy}>
              <ThemedText style={styles.name}>Daily digest</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {settings.dailyDigest ? "Every morning" : "Disabled"}
              </ThemedText>
            </View>
            <ThemedText style={styles.value}>
              {settings.dailyDigest ? "ON" : "OFF"}
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() =>
              updateSettings({
                appearance: settings.appearance === "dark" ? "light" : "dark",
              })
            }
            style={styles.row}
          >
            <View style={styles.rowCopy}>
              <ThemedText style={styles.name}>Appearance</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {settings.appearance === "dark"
                  ? "Dark preference"
                  : "Light preference"}
              </ThemedText>
            </View>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </Pressable>
        </Panel>
      </View>
      <View>
        <SectionHeader title="About" />
        <Panel style={styles.about}>
          <ThemedText style={styles.name}>Work App</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            A quiet place for meaningful work.
          </ThemedText>
          <ThemedText type="small" style={styles.version}>
            Version 1.0.0 · Local workspace
          </ThemedText>
        </Panel>
      </View>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: "row", alignItems: "center", gap: 14 },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F4B3A3",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: { fontSize: 20, fontWeight: "800" },
  profileCopy: { flex: 1, gap: 3 },
  input: {
    backgroundColor: "#F7F3ED",
    borderRadius: 10,
    color: "#272522",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  edit: { color: "#D7614B" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  rowCopy: { flex: 1, gap: 3 },
  name: { fontWeight: "800" },
  value: { color: "#6FB48C", fontWeight: "800", fontSize: 12 },
  chevron: { fontSize: 24, color: "#756F67" },
  about: { gap: 8 },
  version: { marginTop: 8, color: "#D7614B" },
});
