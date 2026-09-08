import { StyleSheet, Text, TextProps } from "react-native";

import { Colors, Fonts, ThemeColor } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type TextType =
  | "default"
  | "title"
  | "subtitle"
  | "small"
  | "smallBold"
  | "code"
  | "link"
  | "linkPrimary";

type ThemedTextProps = TextProps & {
  type?: TextType;
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = "default",
  themeColor = "text",
  ...props
}: ThemedTextProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return (
    <Text
      style={[{ color: Colors[scheme][themeColor] }, styles[type], style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontFamily: Fonts?.sans, fontSize: 16, lineHeight: 24 },
  title: {
    fontFamily: Fonts?.rounded,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
  subtitle: { fontSize: 24, fontWeight: "600", lineHeight: 30 },
  small: { fontFamily: Fonts?.sans, fontSize: 13, lineHeight: 18 },
  smallBold: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  code: { fontFamily: Fonts?.mono, fontSize: 13 },
  link: { color: "#208AEF", fontWeight: "600" },
  linkPrimary: { color: "#208AEF", fontWeight: "600" },
});
