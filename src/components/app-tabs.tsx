import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Platform, useColorScheme, useWindowDimensions } from "react-native";

import { Colors } from "@/constants/theme";

const icons = {
  index: { ios: "house.fill", android: "home", web: "home" },
  tasks: {
    ios: "checkmark.circle.fill",
    android: "check_circle",
    web: "check_circle",
  },
  calendar: { ios: "calendar", android: "event", web: "event" },
  notes: { ios: "note.text", android: "description", web: "description" },
  team: { ios: "person.2.fill", android: "group", web: "group" },
  settings: { ios: "gearshape.fill", android: "settings", web: "settings" },
} as const;

type TabName = keyof typeof icons;

export default function AppTabs() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { width } = useWindowDimensions();
  const isCompact = width < 520;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D7614B",
        tabBarInactiveTintColor: scheme === "dark" ? "#A9A096" : "#9A9187",
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: isCompact ? "below-icon" : "beside-icon",
        tabBarLabelStyle: {
          fontSize: isCompact ? 10 : 11,
          fontWeight: "700",
          marginTop: isCompact ? 2 : 0,
        },
        tabBarItemStyle: {
          minWidth: 0,
          paddingHorizontal: isCompact ? 0 : 6,
        },
        tabBarStyle: {
          height: isCompact ? 72 : 64,
          paddingTop: isCompact ? 7 : 0,
          paddingBottom: Platform.OS === "ios" ? 12 : 7,
          backgroundColor: Colors[scheme].panel,
          borderTopColor: scheme === "dark" ? "#48443D" : "#E7E1D8",
          borderTopWidth: 1,
          elevation: 10,
          shadowColor: "#272522",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -5 },
        },
      }}
    >
      {(Object.keys(icons) as TabName[]).map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title:
              name === "index" ? "Home" : name[0].toUpperCase() + name.slice(1),
            tabBarIcon: ({ color, focused }) => (
              <SymbolView
                name={icons[name]}
                tintColor={color}
                size={focused ? 23 : 21}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
