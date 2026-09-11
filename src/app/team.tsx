import { Panel, SectionHeader, ThemedText, Workspace } from "@/components";
import { Colors } from "@/constants/theme";
import { TeamMember, TeamStatus, useWorkspace } from "@/features/workspace";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

const statusCycle: Record<TeamStatus, TeamStatus> = {
  online: "focus",
  focus: "away",
  away: "online",
};

const statusLabels: Record<TeamStatus, string> = {
  online: "Online",
  focus: "In focus",
  away: "Away",
};

export default function TeamScreen() {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } =
    useWorkspace();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");

  const activeCount = useMemo(
    () => team.filter((m) => m.status === "online" || m.status === "focus").length,
    [team],
  );

  const pulsePercent = useMemo(
    () => (team.length > 0 ? Math.round((activeCount / team.length) * 100) : 0),
    [activeCount, team.length],
  );

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
      project: project.trim() || "Collaboration",
      lastActive: "Active now",
    });
    setName("");
    setRole("");
    setProject("");
    setIsAdding(false);
  }

  function cycleStatus(member: TeamMember) {
    const nextStatus = statusCycle[member.status] || "online";
    const nextActive =
      nextStatus === "online"
        ? "Active now"
        : nextStatus === "focus"
          ? "In focus mode"
          : "Away";
    updateTeamMember(member.id, {
      status: nextStatus,
      lastActive: nextActive,
    });
  }

  function confirmDelete(member: TeamMember) {
    Alert.alert("Remove team member?", member.name, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => deleteTeamMember(member.id),
      },
    ]);
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
          <ThemedText style={styles.bannerSubtitle}>
            {team.length} people · {team.length * 3} active projects
          </ThemedText>
        </View>
        <View style={styles.avatarStack}>
          {team.slice(0, 4).map((member) => (
            <View
              key={member.id}
              style={[styles.avatar, { backgroundColor: member.color }]}
            >
              <ThemedText type="smallBold" style={styles.avatarText}>
                {member.initials}
              </ThemedText>
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
              value={role}
              onChangeText={setRole}
              placeholder="Role (e.g. Designer, Engineer)"
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
            <TextInput
              value={project}
              onChangeText={setProject}
              placeholder="Project (e.g. Mobile App, Branding)"
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
            <Pressable onPress={submit} style={styles.submit}>
              <ThemedText style={styles.submitText}>Add teammate</ThemedText>
            </Pressable>
          </Panel>
        )}
        <Panel>
          {team.map((member, index) => (
            <View key={member.id}>
              {index > 0 && (
                <View
                  style={[styles.divider, { backgroundColor: Colors[scheme].border }]}
                />
              )}
              <View style={styles.person}>
                <View
                  style={[styles.personAvatar, { backgroundColor: member.color }]}
                >
                  <ThemedText type="smallBold" style={styles.personAvatarText}>
                    {member.initials}
                  </ThemedText>
                </View>
                <View style={styles.personCopy}>
                  <ThemedText style={styles.name}>{member.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {member.role} · {member.project}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => cycleStatus(member)}
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        member.status === "online"
                          ? "#E2F4E9"
                          : member.status === "focus"
                            ? "#E1EDF7"
                            : "#FAF0D7",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      member.status === "online" && styles.online,
                      member.status === "focus" && styles.focus,
                      member.status === "away" && styles.away,
                    ]}
                  />
                  <ThemedText style={styles.statusLabel}>
                    {statusLabels[member.status]}
                  </ThemedText>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Remove ${member.name}`}
                  onPress={() => confirmDelete(member)}
                  hitSlop={8}
                >
                  <ThemedText style={styles.delete}>×</ThemedText>
                </Pressable>
              </View>
            </View>
          ))}
          {team.length === 0 && (
            <ThemedText themeColor="textSecondary">
              No team members yet. Invite a teammate to collaborate.
            </ThemedText>
          )}
        </Panel>
      </View>
      <View>
        <SectionHeader title="Team pulse" />
        <Panel style={styles.pulse}>
          <ThemedText style={styles.pulseNumber}>{pulsePercent}%</ThemedText>
          <View style={styles.pulseCopy}>
            <ThemedText style={styles.pulseTitle}>
              {pulsePercent >= 70
                ? "High momentum across team"
                : pulsePercent >= 40
                  ? "Steady collaboration rhythm"
                  : "Quiet hours / heads down"}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {activeCount} of {team.length} teammates active or in focus right now
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
    padding: 20,
    borderRadius: 18,
  },
  bannerTitle: { color: "#FFFDF8", fontSize: 22, fontWeight: "800" },
  bannerSubtitle: { color: "#C4BDB3", marginTop: 2 },
  avatarStack: { flexDirection: "row" },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#272522",
    marginLeft: -8,
  },
  avatarText: { color: "#272522" },
  form: { gap: 10, marginBottom: 12 },
  input: {
    borderRadius: 10,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
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
  divider: { height: 1, marginVertical: 8 },
  person: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  personAvatarText: { color: "#272522" },
  personCopy: { flex: 1, gap: 2 },
  name: { fontWeight: "800", fontSize: 16 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  online: { backgroundColor: "#6FB48C" },
  focus: { backgroundColor: "#6C9CB8" },
  away: { backgroundColor: "#D5A92F" },
  statusLabel: { fontSize: 12, fontWeight: "700", color: "#272522" },
  delete: { color: "#D7614B", fontSize: 24, paddingHorizontal: 4 },
  pulse: { flexDirection: "row", alignItems: "center", gap: 18, padding: 18 },
  pulseNumber: { fontSize: 36, fontWeight: "800", color: "#D7614B" },
  pulseCopy: { flex: 1, gap: 4 },
  pulseTitle: { fontWeight: "800", fontSize: 16 },
});
