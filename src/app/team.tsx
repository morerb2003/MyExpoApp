import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Panel, SectionHeader, Workspace } from "@/components/workspace";

const people = [
  ["MS", "Maya Singh", "Product designer", "#F4B3A3"],
  ["JL", "Jordan Lee", "Engineering lead", "#BED8EA"],
  ["KN", "Kira Nolan", "Research partner", "#C4E3D5"],
  ["OB", "Owen Brooks", "Growth strategist", "#F4D98B"],
];

export default function TeamScreen() {
  return (
    <Workspace
      eyebrow="TEAM / STUDIO"
      title="Good work is a team sport."
      description="See what your people are working on and find the right moment to connect."
    >
      <Panel style={styles.teamBanner}>
        <View>
          <ThemedText style={styles.bannerTitle}>Studio team</ThemedText>
          <ThemedText themeColor="textSecondary">
            4 people · 12 active projects
          </ThemedText>
        </View>
        <View style={styles.avatarStack}>
          {people.slice(0, 3).map(([initials, , , color]) => (
            <View
              key={initials}
              style={[styles.avatar, { backgroundColor: color }]}
            >
              <ThemedText type="smallBold">{initials}</ThemedText>
            </View>
          ))}
        </View>
      </Panel>
      <View>
        <SectionHeader title="Your people" action="Invite" />
        <Panel>
          {people.map(([initials, name, role, color]) => (
            <View key={name} style={styles.person}>
              <View style={[styles.personAvatar, { backgroundColor: color }]}>
                <ThemedText type="smallBold">{initials}</ThemedText>
              </View>
              <View style={styles.personCopy}>
                <ThemedText style={styles.name}>{name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {role}
                </ThemedText>
              </View>
              <View style={styles.online} />
              <ThemedText type="small" themeColor="textSecondary">
                Online
              </ThemedText>
            </View>
          ))}
        </Panel>
      </View>
      <View>
        <SectionHeader title="Team pulse" />
        <Panel style={styles.pulse}>
          <ThemedText style={styles.pulseNumber}>78%</ThemedText>
          <View style={styles.pulseCopy}>
            <ThemedText style={styles.name}>
              Feeling good about the week
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Based on the latest team check-in · 3 responses
            </ThemedText>
          </View>
        </Panel>
      </View>
    </Workspace>
  );
}

const styles = StyleSheet.create({
  teamBanner: {
    backgroundColor: "#272522",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: { color: "#FFFDF8", fontSize: 22, fontWeight: "800" },
  avatarStack: { flexDirection: "row" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#272522",
    marginLeft: -8,
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  personAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  personCopy: { flex: 1, gap: 2 },
  name: { fontWeight: "800" },
  online: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#6FB48C" },
  pulse: { flexDirection: "row", alignItems: "center", gap: 18 },
  pulseNumber: { fontSize: 36, fontWeight: "800", color: "#D7614B" },
  pulseCopy: { flex: 1, gap: 4 },
});
