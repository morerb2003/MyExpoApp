import { ReactNode, useMemo } from "react";
import {
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Spacing } from "@/constants/theme";
import { useWorkspaceOptional } from "@/features/workspace";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type WorkspaceProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

type StatCardProps = {
  label: string;
  value: string;
  tone?: "coral" | "mint" | "yellow" | "blue";
};

export function Workspace({
  eyebrow,
  title,
  description,
  children,
}: WorkspaceProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 600;
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const workspace = useWorkspaceOptional();
  const profileName = workspace?.settings?.profileName || "Alex Rivera";

  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date()).toUpperCase();
  }, []);

  const avatarInitials = useMemo(() => {
    return profileName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profileName]);

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.topBar, isCompact && styles.topBarCompact]}>
            <View style={[styles.brandMark, { backgroundColor: Colors[scheme].text }]}>
              <ThemedText style={[styles.brandLetter, { color: Colors[scheme].background }]}>
                W
              </ThemedText>
            </View>
            {!isCompact && (
              <ThemedText type="small" themeColor="textSecondary">
                {todayFormatted}
              </ThemedText>
            )}
            <View style={[styles.avatar, { backgroundColor: scheme === "dark" ? "#48443D" : "#E8D7C5" }]}>
              <ThemedText style={styles.avatarText}>{avatarInitials}</ThemedText>
            </View>
          </View>
          <View style={styles.heading}>
            <ThemedText type="code" style={styles.eyebrow}>
              {eyebrow}
            </ThemedText>
            <ThemedText
              type="title"
              style={[styles.title, isCompact && styles.titleCompact]}
            >
              {title}
            </ThemedText>
            {description && (
              <ThemedText themeColor="textSecondary" style={styles.description}>
                {description}
              </ThemedText>
            )}
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {action && (
        <Pressable onPress={onAction}>
          <ThemedText type="smallBold" style={styles.action}>
            {action}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

export function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: Colors[scheme].panel,
          borderColor: Colors[scheme].border,
          borderWidth: scheme === "dark" ? 1 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function StatCard({ label, value, tone = "coral" }: StatCardProps) {
  return (
    <View style={[styles.statCard, toneStyles[tone]]}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const toneStyles = StyleSheet.create({
  coral: { backgroundColor: "#F4B3A3" },
  mint: { backgroundColor: "#C4E3D5" },
  yellow: { backgroundColor: "#F4D98B" },
  blue: { backgroundColor: "#BED8EA" },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
    padding: Spacing.four,
    paddingBottom: 120,
    gap: Spacing.five,
  },
  topBar: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  topBarCompact: { gap: Spacing.two },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.light.text,
    alignItems: "center",
    justifyContent: "center",
  },
  brandLetter: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  avatar: {
    marginLeft: "auto",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8D7C5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "800" },
  heading: { gap: Spacing.two },
  eyebrow: { color: "#D7614B", letterSpacing: 1.2 },
  title: { fontSize: 38, lineHeight: 44 },
  titleCompact: { fontSize: 32, lineHeight: 38 },
  description: { maxWidth: 560, lineHeight: 23 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  sectionTitle: { fontSize: 20, lineHeight: 26 },
  action: { color: "#D7614B" },
  panel: {
    borderRadius: 18,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  statValue: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 13, fontWeight: "600" },
});
