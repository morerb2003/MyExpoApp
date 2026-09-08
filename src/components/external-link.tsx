import { ReactElement, ReactNode, cloneElement, isValidElement } from "react";
import { Linking, Pressable } from "react-native";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  asChild?: boolean;
};

export function ExternalLink({
  href,
  children,
  asChild = false,
}: ExternalLinkProps) {
  const onPress = () => Linking.openURL(href);
  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<{ onPress?: () => void }>, {
      onPress,
    });
  }
  return <Pressable onPress={onPress}>{children}</Pressable>;
}
