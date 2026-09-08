import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export function AnimatedIcon() {
  return (
    <View style={styles.icon}>
      <Text style={styles.iconText}>W</Text>
    </View>
  );
}

export function AnimatedSplashOverlay() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return null;
}

const styles = StyleSheet.create({
  icon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#208AEF",
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "700",
  },
});
