import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { useWorkspace } from "@/features/workspace";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function TeamScreen() {
  const { team, addTeamMember } = useWorkspace();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  function submit() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    addTeamMember({
      initials: trimmedName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      name: trimmedName,
      role: role.trim() || "Team member",
      status: "online",
      color: "#BED8EA",
      project: "New collaboration",
      lastActive: "Active now",
    });
    setName("");
    setRole("");
    setIsAdding(false);
  }
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
            {team.length} people · {team.length * 3} active projects
          </ThemedText>
        </View>
        <View style={styles.avatarStack}>
          {team.slice(0, 3).map((member) => (
            <View
              key={member.id}
              style={[styles.avatar, { backgroundColor: member.color }]}
            >
              <ThemedText type="smallBold">{member.initials}</ThemedText>
            </View>
          ))}
        </View>
      </Panel>
      <View>
        <SectionHeader
          title="Your people"
          action={isAdding ? "Close" : "Invite"}
          onAction={() => setIsAdding((value) => !value)}
        />
        {isAdding && (
          <Panel style={styles.form}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#756F67"
              style={styles.input}
              autoFocus
            />
            <TextInput
              value={role}
              onChangeText={setRole}
              placeholder="Role"
              placeholderTextColor="#756F67"
              style={styles.input}
            />
            <Pressable onPress={submit} style={styles.submit}>
              <ThemedText style={styles.submitText}>Add teammate</ThemedText>
            </Pressable>
          </Panel>
        )}
        <Panel>
          {team.map((member) => (
            <View key={member.id} style={styles.person}>
              <View
                style={[styles.personAvatar, { backgroundColor: member.color }]}
              >
                <ThemedText type="smallBold">{member.initials}</ThemedText>
              </View>
              <View style={styles.personCopy}>
                <ThemedText style={styles.name}>{member.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {member.role} · {member.project}
                </ThemedText>
              </View>
              <View
                style={[styles.online, member.status === "away" && styles.away]}
              />
              <ThemedText type="small" themeColor="textSecondary">
                {member.lastActive}
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
              Based on the latest team check-in
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
  form: { gap: 10, marginBottom: 12 },
  input: {
    backgroundColor: "#F7F3ED",
    borderRadius: 10,
    color: "#272522",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  submit: {
    alignSelf: "flex-start",
    backgroundColor: "#272522",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitText: { color: "#FFFDF8", fontWeight: "800" },
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
  away: { backgroundColor: "#D5A92F" },
  pulse: { flexDirection: "row", alignItems: "center", gap: 18 },
  pulseNumber: { fontSize: 36, fontWeight: "800", color: "#D7614B" },
  pulseCopy: { flex: 1, gap: 4 },
});
