import { StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";

export function WebBadge() {
  return (
    <View style={styles.badge}>
      <ThemedText type="small">Running on web</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 8, paddingHorizontal: 12 },
});
