import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Panel, SectionHeader, Workspace } from "@/components/workspace";

const settings = [
  ["Profile", "Alex Rivera", "AR"],
  ["Notifications", "Daily digest at 8:00 AM", "›"],
  ["Appearance", "System preference", "›"],
  ["Workspace", "Studio team", "›"],
];

export default function SettingsScreen() {
  return (
    <Workspace
      eyebrow="SETTINGS / WORK APP"
      title="Make it feel like yours."
      description="Your preferences, your rhythm, your workspace."
    >
      <Panel style={styles.profile}>
        <View style={styles.profileAvatar}>
          <ThemedText style={styles.profileInitials}>AR</ThemedText>
        </View>
        <View style={styles.profileCopy}>
          <ThemedText style={styles.name}>Alex Rivera</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            alex@studio.co
          </ThemedText>
        </View>
        <ThemedText type="smallBold" style={styles.edit}>
          Edit
        </ThemedText>
      </Panel>
      <View>
        <SectionHeader title="Preferences" />
        <Panel>
          {settings.slice(1).map(([label, value, icon]) => (
            <Pressable key={label} style={styles.row}>
              <View style={styles.rowCopy}>
                <ThemedText style={styles.name}>{label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {value}
                </ThemedText>
              </View>
              <ThemedText style={styles.chevron}>{icon}</ThemedText>
            </Pressable>
          ))}
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
            Version 1.0.0
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
  edit: { color: "#D7614B" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  rowCopy: { flex: 1, gap: 3 },
  name: { fontWeight: "800" },
  chevron: { fontSize: 24, color: "#756F67" },
  about: { gap: 8 },
  version: { marginTop: 8, color: "#D7614B" },
});
