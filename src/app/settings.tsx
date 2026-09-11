import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { Colors } from "@/constants/theme";
import { AppearancePreference, useWorkspace } from "@/features/workspace";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

const appearanceOrder: AppearancePreference[] = ["system", "light", "dark"];
const appearanceLabels: Record<AppearancePreference, string> = {
  system: "System default",
  light: "Light mode",
  dark: "Dark mode",
};

export default function SettingsScreen() {
  const { settings, updateSettings, resetWorkspace } = useWorkspace();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const [editing, setEditing] = useState(false);
  const [profileName, setProfileName] = useState(settings.profileName);
  const [email, setEmail] = useState(settings.email);

  const initials = settings.profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function saveProfile() {
    if (profileName.trim()) {
      updateSettings({
        profileName: profileName.trim(),
        email: email.trim() || settings.email,
      });
    }
    setEditing(false);
  }

  function cycleAppearance() {
    const currentIndex = appearanceOrder.indexOf(settings.appearance);
    const nextIndex = (currentIndex + 1) % appearanceOrder.length;
    updateSettings({ appearance: appearanceOrder[nextIndex] });
  }

  function confirmReset() {
    Alert.alert(
      "Reset workspace?",
      "This will restore tasks, notes, events, and team members to initial sample data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset to sample data",
          style: "destructive",
          onPress: () => {
            resetWorkspace();
            setProfileName("Alex Rivera");
            setEmail("alex@studio.co");
            setEditing(false);
          },
        },
      ],
    );
  }

  return (
    <Workspace
      eyebrow="SETTINGS / WORKSPACE"
      title="Make it feel like yours."
      description="Your preferences, your rhythm, your workspace."
    >
      <Panel style={styles.profile}>
        <View style={styles.profileAvatar}>
          <ThemedText style={styles.profileInitials}>{initials}</ThemedText>
        </View>
        <View style={styles.profileCopy}>
          {editing ? (
            <View style={styles.editInputs}>
              <TextInput
                value={profileName}
                onChangeText={setProfileName}
                placeholder="Full name"
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
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
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
            </View>
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
        <Pressable
          onPress={() => (editing ? saveProfile() : setEditing(true))}
          hitSlop={8}
        >
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
            <ThemedText
              style={[
                styles.value,
                { color: settings.notifications ? "#6FB48C" : Colors[scheme].textSecondary },
              ]}
            >
              {settings.notifications ? "ON" : "OFF"}
            </ThemedText>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: Colors[scheme].border }]} />

          <Pressable
            onPress={() =>
              updateSettings({ dailyDigest: !settings.dailyDigest })
            }
            style={styles.row}
          >
            <View style={styles.rowCopy}>
              <ThemedText style={styles.name}>Daily digest</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {settings.dailyDigest ? "Every morning briefing" : "Disabled"}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.value,
                { color: settings.dailyDigest ? "#6FB48C" : Colors[scheme].textSecondary },
              ]}
            >
              {settings.dailyDigest ? "ON" : "OFF"}
            </ThemedText>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: Colors[scheme].border }]} />

          <Pressable onPress={cycleAppearance} style={styles.row}>
            <View style={styles.rowCopy}>
              <ThemedText style={styles.name}>Appearance theme</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {appearanceLabels[settings.appearance]}
              </ThemedText>
            </View>
            <ThemedText type="smallBold" style={styles.themeValue}>
              {settings.appearance.toUpperCase()} ›
            </ThemedText>
          </Pressable>
        </Panel>
      </View>

      <View>
        <SectionHeader title="Workspace data" />
        <Panel>
          <View style={styles.resetRow}>
            <View style={styles.rowCopy}>
              <ThemedText style={styles.name}>Reset sample workspace</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Restore starter tasks, notes, schedule, and team members
              </ThemedText>
            </View>
            <Pressable onPress={confirmReset} style={styles.resetBtn}>
              <ThemedText style={styles.resetText}>Reset</ThemedText>
            </Pressable>
          </View>
        </Panel>
      </View>

      <View>
        <SectionHeader title="About" />
        <Panel style={styles.about}>
          <ThemedText style={styles.name}>MyExpoApp Workspace</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            An editorial, calm command center for meaningful work and focused execution.
          </ThemedText>
          <ThemedText type="small" style={styles.version}>
            Version 1.0.0 · Expo SDK 57 · Offline-first
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
  profileInitials: { fontSize: 20, fontWeight: "800", color: "#272522" },
  profileCopy: { flex: 1, gap: 3 },
  editInputs: { gap: 6 },
  input: {
    borderRadius: 10,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
  },
  edit: { color: "#D7614B" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  divider: { height: 1, marginVertical: 2 },
  rowCopy: { flex: 1, gap: 3 },
  name: { fontWeight: "800" },
  value: { fontWeight: "800", fontSize: 13 },
  themeValue: { color: "#D7614B", fontSize: 13 },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 4,
  },
  resetBtn: {
    backgroundColor: "#D7614B",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  resetText: { color: "#FFFDF8", fontWeight: "800", fontSize: 13 },
  about: { gap: 8 },
  version: { marginTop: 4, color: "#D7614B" },
});
